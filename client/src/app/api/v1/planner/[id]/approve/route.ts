import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import {
  approveExecutionPlan,
  getExecutionPlan,
  serializePlan,
} from "@/ai/planner";
import { jsonError, jsonOk } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await getExecutionPlan(id);
    await requireWorkspaceMember(existing.workspaceId, user.userId);
    const plan = await approveExecutionPlan(id, user.userId);
    return jsonOk({ plan: serializePlan(plan) });
  } catch (error) {
    return jsonError(error);
  }
}
