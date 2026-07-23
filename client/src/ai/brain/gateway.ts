import { prisma } from "@/infra/db/prisma";
import { classifyIntent } from "@/brain/planner/intent";
import { buildExecutionPlan } from "@/brain/planner/plan";
import { gatherContext } from "@/brain/context/engine";
import { selectAgent, getAgentProfile } from "@/brain/routing/agents";
import { getModelAdapter } from "@/brain/routing/models";
import { serializeObject } from "@/lib/object-auth";
import { AppError } from "@/platform/errors";
import { eventBus, PlatformEvents } from "@/platform";
import { runApprovedPlan } from "@/ai/execution/engine";
import { search as searchAdapter } from "@/infra/search/postgres-keyword";
import {
  approveExecutionPlan,
  createExecutionPlan,
  getExecutionPlan,
  serializePlan,
} from "@/ai/planner";
import type {
  BrainExecuteResult,
  BrainPlanResult,
  BrainRunInput,
} from "@/brain/types";
import type { Prisma } from "@/generated/prisma3";

function contextSummaryFromBundle(objectNames: string[], memoryKeys: string[]) {
  const parts: string[] = [];
  if (objectNames.length) {
    parts.push(`Objects: ${objectNames.slice(0, 12).join(", ")}`);
  }
  if (memoryKeys.length) {
    parts.push(`Memory keys: ${memoryKeys.slice(0, 8).join(", ")}`);
  }
  return parts.join("\n") || "Empty workspace context";
}

export type BrainExecuteInput = BrainRunInput & {
  executionPlanId?: string | null;
};

export async function plan(
  input: BrainRunInput,
): Promise<BrainPlanResult> {
  const intent = classifyIntent(input.prompt);
  const agent = selectAgent(intent, input.prompt, input.preferredAgent);
  const adapter = getModelAdapter(input.preferredModel);
  const context = await gatherContext({
    workspaceId: input.workspaceId,
    userId: input.userId,
    rootObjectId: input.rootObjectId,
    prompt: input.prompt,
  });
  const planSteps = buildExecutionPlan(intent, input.prompt);
  const requiresConfirmation = planSteps.some((s) => s.requiresConfirmation);

  return {
    intent,
    agent,
    modelProvider: adapter.provider,
    modelId: adapter.modelId,
    plan: planSteps,
    contextObjectIds: context.objectIds,
    requiresConfirmation,
  };
}

/**
 * Principle 5: every execute is associated with an ExecutionPlan and only runs
 * when status is Approved (or auto-approved non-dangerous plans).
 */
async function resolveApprovedPlan(input: BrainExecuteInput) {
  if (input.executionPlanId) {
    const existing = await getExecutionPlan(
      input.executionPlanId,
      input.workspaceId,
    );
    if (existing.status === "PendingApproval" || existing.status === "Draft") {
      if (input.confirm && !existing.approvalRequired) {
        return approveExecutionPlan(existing.id, input.userId);
      }
      if (input.confirm && existing.approvalRequired) {
        return approveExecutionPlan(existing.id, input.userId);
      }
      throw new AppError(
        "PLAN_NOT_APPROVED",
        `Execution plan requires approval (status=${existing.status})`,
        409,
      );
    }
    if (existing.status !== "Approved" && existing.status !== "Running") {
      throw new AppError(
        "PLAN_NOT_APPROVED",
        `Cannot execute plan in status ${existing.status}`,
        400,
      );
    }
    return existing;
  }

  const created = await createExecutionPlan({
    workspaceId: input.workspaceId,
    userId: input.userId,
    prompt: input.prompt,
    rootObjectId: input.rootObjectId,
    preferredAgent: input.preferredAgent,
    preferredModel: input.preferredModel,
  });

  if (created.status === "Approved") {
    return created;
  }

  // Dangerous / approval-required: await unless confirm
  if (!input.confirm) {
    return created;
  }

  return approveExecutionPlan(created.id, input.userId);
}

export async function execute(
  input: BrainExecuteInput,
): Promise<BrainExecuteResult & { executionPlanId: string }> {
  const started = Date.now();
  const executionPlan = await resolveApprovedPlan(input);

  if (
    executionPlan.status === "PendingApproval" ||
    executionPlan.status === "Draft"
  ) {
    const planned = await plan(input);
    return {
      ...planned,
      executionId: "",
      executionPlanId: executionPlan.id,
      status: "AwaitingConfirmation",
      result: { text: "", objectIds: [], toolsUsed: [] },
      durationMs: Date.now() - started,
      error: "Approve the execution plan before running",
    };
  }

  if (executionPlan.status !== "Approved" && executionPlan.status !== "Running") {
    throw new AppError(
      "PLAN_NOT_APPROVED",
      `Cannot execute plan in status ${executionPlan.status}`,
      400,
    );
  }

  const planned = await plan(input);
  const profile = getAgentProfile(planned.agent);
  const adapter = getModelAdapter(input.preferredModel);
  const context = await gatherContext({
    workspaceId: input.workspaceId,
    userId: input.userId,
    rootObjectId: input.rootObjectId,
    prompt: input.prompt,
  });

  await prisma.executionPlan.update({
    where: { id: executionPlan.id },
    data: { status: "Running" },
  });

  const execution = await prisma.brainExecution.create({
    data: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      prompt: input.prompt,
      intent: planned.intent,
      plan: planned.plan as unknown as Prisma.InputJsonValue,
      contextSnapshot: {
        objectIds: context.objectIds,
        memoryKeys: Object.keys(context.memory),
        agentProfile: profile.kind,
        executionPlanId: executionPlan.id,
      } as Prisma.InputJsonValue,
      agent: planned.agent,
      modelProvider: adapter.provider,
      modelId: adapter.modelId,
      status: "Running",
    },
  });

  await prisma.executionPlan.update({
    where: { id: executionPlan.id },
    data: { brainExecutionId: execution.id },
  });

  try {
    // Tool-level confirmation still respected for dangerous tools mid-run
    if (planned.requiresConfirmation && !input.confirm) {
      await prisma.brainExecution.update({
        where: { id: execution.id },
        data: {
          status: "AwaitingConfirmation",
          durationMs: Date.now() - started,
          result: {
            message: "Confirmation required before executing dangerous steps",
            executionPlanId: executionPlan.id,
          } as Prisma.InputJsonValue,
        },
      });

      await prisma.executionPlan.update({
        where: { id: executionPlan.id },
        data: { status: "Approved" },
      });

      await eventBus.publish(PlatformEvents.PromptExecuted, {
        workspaceId: input.workspaceId,
        executionId: execution.id,
        payload: {
          status: "AwaitingConfirmation",
          intent: planned.intent,
          executionPlanId: executionPlan.id,
        },
      });

      return {
        ...planned,
        executionId: execution.id,
        executionPlanId: executionPlan.id,
        status: "AwaitingConfirmation",
        result: { text: "", objectIds: [], toolsUsed: [] },
        durationMs: Date.now() - started,
      };
    }

    const execResult = await runApprovedPlan({
      workspaceId: input.workspaceId,
      executionId: execution.id,
      executionPlanId: executionPlan.id,
      plan: planned.plan,
      ctx: {
        workspaceId: input.workspaceId,
        userId: input.userId,
        confirm: Boolean(input.confirm),
        rootObjectId: input.rootObjectId,
        prompt: input.prompt,
        intent: planned.intent,
      },
      adapter,
      intent: planned.intent,
      agent: planned.agent,
      contextSummary: contextSummaryFromBundle(
        context.objects.map((o) => o.name),
        Object.keys(context.memory),
      ),
    });

    const durationMs = Date.now() - started;
    const status = execResult.awaitingConfirmation
      ? "AwaitingConfirmation"
      : "Completed";

    await prisma.brainExecution.update({
      where: { id: execution.id },
      data: {
        status,
        toolsUsed: execResult.toolsUsed as unknown as Prisma.InputJsonValue,
        result: {
          text: execResult.text,
          toolResults: execResult.toolResults,
          executionPlanId: executionPlan.id,
        } as Prisma.InputJsonValue,
        resultObjectIds: execResult.objectIds,
        tokenUsage: execResult.tokenUsage,
        costCents: execResult.costCents ?? 0,
        durationMs,
      },
    });

    await prisma.executionPlan.update({
      where: { id: executionPlan.id },
      data: {
        status: status === "Completed" ? "Completed" : "Approved",
      },
    });

    await eventBus.publish(PlatformEvents.PromptExecuted, {
      workspaceId: input.workspaceId,
      executionId: execution.id,
      payload: {
        status,
        intent: planned.intent,
        agent: planned.agent,
        objectIds: execResult.objectIds,
        executionPlanId: executionPlan.id,
      },
    });

    return {
      ...planned,
      executionId: execution.id,
      executionPlanId: executionPlan.id,
      status,
      result: {
        text: execResult.text,
        objectIds: execResult.objectIds,
        toolsUsed: execResult.toolsUsed,
      },
      durationMs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution failed";
    const durationMs = Date.now() - started;
    await prisma.brainExecution.update({
      where: { id: execution.id },
      data: {
        status: "Failed",
        error: message,
        durationMs,
      },
    });
    await prisma.executionPlan.update({
      where: { id: executionPlan.id },
      data: { status: "Failed" },
    });
    await eventBus.publish(PlatformEvents.PromptExecuted, {
      workspaceId: input.workspaceId,
      executionId: execution.id,
      payload: {
        status: "Failed",
        error: message,
        executionPlanId: executionPlan.id,
      },
    });
    return {
      ...planned,
      executionId: execution.id,
      executionPlanId: executionPlan.id,
      status: "Failed",
      result: { text: "", objectIds: [], toolsUsed: [] },
      durationMs,
      error: message,
    };
  }
}

export async function context(params: {
  workspaceId: string;
  userId: number;
  rootObjectId?: string | null;
  prompt?: string;
}) {
  const bundle = await gatherContext(params);
  return {
    workspaceId: bundle.workspaceId,
    rootObjectId: bundle.rootObjectId,
    objectIds: bundle.objectIds,
    memory: bundle.memory,
    objects: bundle.objects.map(serializeObject),
  };
}

export async function search(params: {
  workspaceId: string;
  q: string;
}) {
  const objects = await searchAdapter.searchObjects({
    workspaceId: params.workspaceId,
    q: params.q,
  });
  const qLower = params.q.toLowerCase();
  const ranked = [...objects].sort((a, b) => {
    const aName = a.name.toLowerCase().includes(qLower) ? 0 : 1;
    const bName = b.name.toLowerCase().includes(qLower) ? 0 : 1;
    return aName - bName;
  });

  await eventBus.publish(PlatformEvents.PromptExecuted, {
    workspaceId: params.workspaceId,
    payload: { intent: "Search", q: params.q, count: ranked.length },
  });

  return { objects: ranked, q: params.q };
}

export async function listExecutions(workspaceId: string, take = 20) {
  const rows = await prisma.brainExecution.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      user: { select: { userId: true, username: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    prompt: r.prompt,
    intent: r.intent,
    agent: r.agent,
    modelProvider: r.modelProvider,
    modelId: r.modelId,
    status: r.status,
    resultObjectIds: r.resultObjectIds,
    durationMs: r.durationMs,
    error: r.error,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
  }));
}

export const brainGateway = {
  name: "brain-gateway",
  plan,
  execute,
  context,
  search,
  listExecutions,
  serializePlan,
};
