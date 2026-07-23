import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { listExecutionPlans, serializePlan } from "@/ai/planner";
import { jsonError, jsonOk } from "@/lib/api-response";
import { z } from "zod";

const querySchema = z.object({
  workspaceId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);

    const plans = await listExecutionPlans(query.workspaceId);
    return jsonOk({ plans: plans.map(serializePlan) });
  } catch (error) {
    return jsonError(error);
  }
}
