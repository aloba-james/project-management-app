import { prisma } from "@/lib/prisma";
import { classifyIntent } from "@/brain/planner/intent";
import { gatherContext } from "@/brain/context/engine";
import { publishBrainEvent } from "@/brain/events/publish";
import {
  estimateComplexity,
  estimateCost,
  estimateStrategy,
  recommendModel,
} from "@/planner/estimate";
import {
  buildPlannerSteps,
  resolvePlannerAgent,
} from "@/planner/steps";
import {
  collectDependencies,
  collectWarnings,
  requiresApproval,
} from "@/planner/dependencies";
import type { CreatePlanInput, PlannerDraft } from "@/planner/types";
import type { Prisma } from "@/generated/prisma3";
import { AuthError } from "@/lib/workspace-auth";

function stepKey(order: number) {
  return `s${order}`;
}

export function buildPlannerDraft(input: {
  prompt: string;
  preferredAgent?: CreatePlanInput["preferredAgent"];
  preferredModel?: CreatePlanInput["preferredModel"];
  contextObjectIds?: string[];
}): PlannerDraft {
  const intent = classifyIntent(input.prompt);
  const agent = resolvePlannerAgent(intent, input.prompt, input.preferredAgent);
  const modelRec = input.preferredModel
    ? {
        provider: input.preferredModel,
        modelId:
          input.preferredModel === "LocalStub"
            ? "local-stub-v1"
            : `${input.preferredModel.toLowerCase()}-default`,
        reason: "User preferred model",
      }
    : recommendModel(intent, input.prompt);

  const steps = buildPlannerSteps({
    intent,
    prompt: input.prompt,
    agent,
    modelId: modelRec.modelId,
  }).map((s) => ({
    ...s,
    // Normalize dependsOn to step keys s1, s2...
    dependsOn: s.dependsOn.map((d) =>
      d.startsWith("s") ? d : stepKey(Number(d) || 1),
    ),
  }));

  // Fix dependsOn to use consistent sN keys based on order
  const normalized = steps.map((s) => ({
    ...s,
    dependsOn:
      s.order <= 1
        ? []
        : s.dependsOn.length
          ? s.dependsOn
          : [stepKey(s.order - 1)],
  }));

  const complexity = estimateComplexity(intent, input.prompt, normalized.length);
  const strategy = estimateStrategy(intent, normalized.length);
  const estimates = estimateCost({
    complexity,
    stepCount: normalized.length,
    promptLength: input.prompt.length,
  });
  const approvalRequired = requiresApproval(intent, input.prompt, normalized);
  const dependencies = collectDependencies(intent, input.prompt, normalized);
  const warnings = collectWarnings(intent, normalized, approvalRequired);

  const goal =
    input.prompt.trim().length > 120
      ? `${input.prompt.trim().slice(0, 117)}...`
      : input.prompt.trim();

  return {
    goal,
    summary: `Plan to ${intent.toLowerCase()} based on: “${goal}”. Strategy: ${strategy}. ${modelRec.reason}.`,
    intent,
    complexity,
    strategy,
    estimatedDuration: estimates.estimatedDuration,
    estimatedTokens: estimates.estimatedTokens,
    estimatedCost: estimates.estimatedCost,
    approvalRequired,
    dependencies,
    warnings,
    requiredAgents: [...new Set(normalized.map((s) => s.agent))],
    requiredModels: [modelRec.modelId],
    requiredTools: [...new Set(normalized.map((s) => s.tool))],
    requiredObjects: [
      ...new Set(normalized.flatMap((s) => s.outputObjectHints)),
    ],
    steps: normalized,
    recommendedModelProvider: modelRec.provider,
    recommendedModelId: modelRec.modelId,
    recommendedAgent: agent,
  };
}

export async function createExecutionPlan(input: CreatePlanInput) {
  const context = await gatherContext({
    workspaceId: input.workspaceId,
    userId: input.userId,
    rootObjectId: input.rootObjectId,
    prompt: input.prompt,
  });

  const draft = buildPlannerDraft({
    prompt: input.prompt,
    preferredAgent: input.preferredAgent,
    preferredModel: input.preferredModel,
    contextObjectIds: context.objectIds,
  });

  const status = draft.approvalRequired ? "PendingApproval" : "Approved";

  const plan = await prisma.executionPlan.create({
    data: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      prompt: input.prompt,
      goal: draft.goal,
      summary: draft.summary,
      intent: draft.intent,
      complexity: draft.complexity,
      strategy: draft.strategy,
      estimatedDuration: draft.estimatedDuration,
      estimatedTokens: draft.estimatedTokens,
      estimatedCost: draft.estimatedCost,
      status,
      approvalRequired: draft.approvalRequired,
      dependencies: draft.dependencies as unknown as Prisma.InputJsonValue,
      warnings: draft.warnings as unknown as Prisma.InputJsonValue,
      requiredAgents: draft.requiredAgents,
      requiredModels: draft.requiredModels,
      requiredTools: draft.requiredTools,
      requiredObjects: draft.requiredObjects,
      selectedObjectIds: input.selectedObjectIds ?? context.objectIds.slice(0, 10),
      rootObjectId: input.rootObjectId ?? null,
      metadata: {
        recommendedAgent: draft.recommendedAgent,
        recommendedModelProvider: draft.recommendedModelProvider,
        recommendedModelId: draft.recommendedModelId,
      } as Prisma.InputJsonValue,
      steps: {
        create: draft.steps.map((s) => ({
          order: s.order,
          title: s.title,
          description: s.description,
          agent: s.agent,
          tool: s.tool,
          model: s.model,
          estimatedTime: s.estimatedTime,
          estimatedCost: s.estimatedCost,
          dependsOn: s.dependsOn,
          approvalRequired: s.approvalRequired,
          outputObjects: s.outputObjectHints,
          status: "Pending",
        })),
      },
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  await publishBrainEvent({
    workspaceId: input.workspaceId,
    type: "PlanCreated",
    payload: {
      planId: plan.id,
      intent: plan.intent,
      status: plan.status,
      stepCount: plan.steps.length,
    },
  });

  return plan;
}

export function serializePlan<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    dependencies: unknown;
    warnings: unknown;
    metadata: unknown;
    steps?: Array<{
      createdAt: Date;
      updatedAt: Date;
      [key: string]: unknown;
    }>;
  },
>(plan: T) {
  return {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    steps: plan.steps?.map((s) => ({
      ...s,
      createdAt: (s.createdAt as Date).toISOString(),
      updatedAt: (s.updatedAt as Date).toISOString(),
    })),
  };
}

export async function listExecutionPlans(workspaceId: string, take = 30) {
  return prisma.executionPlan.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take,
    include: { steps: { orderBy: { order: "asc" } } },
  });
}

export async function getExecutionPlan(id: string, workspaceId?: string) {
  const plan = await prisma.executionPlan.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!plan) throw new AuthError("Plan not found", 404);
  if (workspaceId && plan.workspaceId !== workspaceId) {
    throw new AuthError("Forbidden", 403);
  }
  return plan;
}

export async function approveExecutionPlan(id: string, userId: number) {
  const plan = await getExecutionPlan(id);
  if (plan.status !== "PendingApproval" && plan.status !== "Draft") {
    throw new AuthError(`Cannot approve plan in status ${plan.status}`, 400);
  }
  const updated = await prisma.executionPlan.update({
    where: { id },
    data: { status: "Approved" },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  await publishBrainEvent({
    workspaceId: plan.workspaceId,
    type: "PlanApproved",
    payload: { planId: id, userId },
  });
  return updated;
}

export async function cancelExecutionPlan(id: string, userId: number) {
  const plan = await getExecutionPlan(id);
  if (["Completed", "Cancelled"].includes(plan.status)) {
    throw new AuthError(`Cannot cancel plan in status ${plan.status}`, 400);
  }
  await prisma.executionPlanStep.updateMany({
    where: {
      planId: id,
      status: { in: ["Pending", "Ready", "Running"] },
    },
    data: { status: "Cancelled" },
  });
  const updated = await prisma.executionPlan.update({
    where: { id },
    data: { status: "Cancelled" },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  await publishBrainEvent({
    workspaceId: plan.workspaceId,
    type: "PlanRejected",
    payload: { planId: id, userId, action: "cancel" },
  });
  return updated;
}

export async function resumeExecutionPlan(id: string, userId: number) {
  const plan = await getExecutionPlan(id);
  if (!["Approved", "Paused", "Failed"].includes(plan.status)) {
    if (plan.status === "PendingApproval") {
      throw new AuthError("Approve the plan before resuming execution", 400);
    }
    throw new AuthError(`Cannot resume plan in status ${plan.status}`, 400);
  }

  const updated = await prisma.executionPlan.update({
    where: { id },
    data: { status: "Running" },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  await publishBrainEvent({
    workspaceId: plan.workspaceId,
    type: "PlanStarted",
    payload: { planId: id, userId },
  });

  return updated;
}
