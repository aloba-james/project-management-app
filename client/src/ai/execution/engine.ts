import { executePlan } from "@/brain/execution/executor";
import type {
  BrainAgentKind,
  BrainIntent,
  BrainModelProvider,
} from "@/generated/prisma3";
import type { ModelAdapter, PlanStep, ToolContext } from "@/brain/types";
import { eventBus, PlatformEvents } from "@/platform";

/**
 * Execution Engine — runs approved tool plans (never plans itself).
 */
export async function runApprovedPlan(params: {
  workspaceId: string;
  executionId: string;
  plan: PlanStep[];
  ctx: ToolContext;
  adapter: ModelAdapter;
  intent: BrainIntent;
  agent: BrainAgentKind;
  contextSummary: string;
  executionPlanId?: string;
}) {
  await eventBus.publish(PlatformEvents.ExecutionStarted, {
    workspaceId: params.workspaceId,
    executionId: params.executionId,
    payload: {
      executionPlanId: params.executionPlanId,
      intent: params.intent,
      agent: params.agent,
    },
  });

  try {
    const result = await executePlan({
      plan: params.plan,
      ctx: params.ctx,
      adapter: params.adapter,
      intent: params.intent,
      agent: params.agent,
      contextSummary: params.contextSummary,
    });

    await eventBus.publish(PlatformEvents.ExecutionCompleted, {
      workspaceId: params.workspaceId,
      executionId: params.executionId,
      payload: {
        executionPlanId: params.executionPlanId,
        objectIds: result.objectIds,
        toolsUsed: result.toolsUsed,
        awaitingConfirmation: result.awaitingConfirmation,
      },
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution failed";
    await eventBus.publish(PlatformEvents.ExecutionFailed, {
      workspaceId: params.workspaceId,
      executionId: params.executionId,
      payload: {
        executionPlanId: params.executionPlanId,
        error: message,
      },
    });
    throw error;
  }
}

export const executionEngine = {
  name: "execution-engine",
  runApprovedPlan,
  health() {
    return { ok: true, detail: "in-process tool runner" };
  },
};

export type { BrainModelProvider };
