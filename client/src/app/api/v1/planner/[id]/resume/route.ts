import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import {
  getExecutionPlan,
  resumeExecutionPlan,
  serializePlan,
} from "@/ai/planner";
import { brainGateway } from "@/ai/brain/gateway";
import { jsonError, jsonOk } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

/**
 * Resume marks the plan Running and triggers Brain execution for the original prompt.
 * Planner still does not call models directly — Brain + adapters do.
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await getExecutionPlan(id);
    await requireWorkspaceMember(existing.workspaceId, user.userId);

    const body = (await request.json().catch(() => ({}))) as {
      confirm?: boolean;
    };

    const plan = await resumeExecutionPlan(id, user.userId);

    const execution = await brainGateway.execute({
      workspaceId: plan.workspaceId,
      userId: user.userId,
      prompt: plan.prompt,
      rootObjectId: plan.rootObjectId,
      executionPlanId: plan.id,
      confirm: Boolean(body.confirm) || !plan.approvalRequired,
    });

    const refreshed = await getExecutionPlan(id);
    return jsonOk({
      plan: serializePlan(refreshed),
      execution,
    });
  } catch (error) {
    return jsonError(error);
  }
}
