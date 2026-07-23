import type { PlanStep, ToolContext, ToolResult } from "@/brain/types";
import { runTool } from "@/brain/tools/registry";
import type { ModelAdapter } from "@/brain/types";
import type { BrainAgentKind, BrainIntent } from "@/generated/prisma3";

export type ExecutorResult = {
  toolsUsed: string[];
  toolResults: ToolResult[];
  objectIds: string[];
  text: string;
  tokenUsage?: number;
  costCents?: number;
  awaitingConfirmation: boolean;
};

export async function executePlan(params: {
  plan: PlanStep[];
  ctx: ToolContext;
  adapter: ModelAdapter;
  intent: BrainIntent;
  agent: BrainAgentKind;
  contextSummary: string;
}): Promise<ExecutorResult> {
  const toolsUsed: string[] = [];
  const toolResults: ToolResult[] = [];
  const objectIds: string[] = [];
  let generatedText = "";
  let tokenUsage: number | undefined;
  let costCents: number | undefined;
  let awaitingConfirmation = false;
  let lastCreatedId: string | undefined;

  // Run model once if plan includes model_complete
  if (params.plan.some((s) => s.tool === "model_complete")) {
    const completion = await params.adapter.complete({
      prompt: params.ctx.prompt,
      intent: params.intent,
      agent: params.agent,
      contextSummary: params.contextSummary,
    });
    generatedText = completion.text;
    tokenUsage = completion.tokenUsage;
    costCents = completion.costCents;
    toolsUsed.push("model_complete");
    toolResults.push({
      ok: true,
      tool: "model_complete",
      message: "Model completed",
      data: { preview: generatedText.slice(0, 200) },
    });
  }

  for (const step of params.plan) {
    if (step.tool === "model_complete") continue;

    const result = await runTool(
      step.tool,
      { ...params.ctx, generatedText },
      {
        ...step.args,
        createdObjectId: lastCreatedId,
      },
    );

    toolsUsed.push(step.tool);
    toolResults.push(result);

    if (result.requiresConfirmation) {
      awaitingConfirmation = true;
      break;
    }

    if (result.objectIds?.length) {
      objectIds.push(...result.objectIds);
      if (step.tool === "create_object") {
        lastCreatedId = result.objectIds[0];
      }
    }
  }

  return {
    toolsUsed: [...new Set(toolsUsed)],
    toolResults,
    objectIds: [...new Set(objectIds)],
    text: generatedText,
    tokenUsage,
    costCents,
    awaitingConfirmation,
  };
}
