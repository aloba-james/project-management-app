import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { createExecutionPlan, serializePlan } from "@/ai/planner";
import { jsonError, jsonOk } from "@/lib/api-response";
import { createPlannerSchema } from "@/validators/planner.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createPlannerSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);

    const plan = await createExecutionPlan({
      workspaceId: body.workspaceId,
      userId: user.userId,
      prompt: body.prompt,
      rootObjectId: body.rootObjectId,
      selectedObjectIds: body.selectedObjectIds,
      preferredAgent: body.preferredAgent,
      preferredModel: body.preferredModel,
    });

    return jsonOk({ plan: serializePlan(plan) }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
