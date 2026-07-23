import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember, AuthError } from "@/lib/workspace-auth";
import { getExecutionPlan, serializePlan } from "@/ai/planner";
import { jsonError, jsonOk } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const plan = await getExecutionPlan(id);
    await requireWorkspaceMember(plan.workspaceId, user.userId);

    const workspaceId = new URL(request.url).searchParams.get("workspaceId");
    if (workspaceId && workspaceId !== plan.workspaceId) {
      throw new AuthError("Forbidden", 403);
    }

    return jsonOk({ plan: serializePlan(plan) });
  } catch (error) {
    return jsonError(error);
  }
}
