import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { brainGateway } from "@/ai/brain/gateway";
import { jsonError, jsonOk } from "@/lib/api-response";
import { brainPromptSchema } from "@/validators/brain.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = brainPromptSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);

    const result = await brainGateway.execute({
      workspaceId: body.workspaceId,
      userId: user.userId,
      prompt: body.prompt,
      rootObjectId: body.rootObjectId,
      executionPlanId: body.executionPlanId,
      confirm: body.confirm,
      preferredAgent: body.preferredAgent,
      preferredModel: body.preferredModel,
    });

    return jsonOk({ execution: result });
  } catch (error) {
    return jsonError(error);
  }
}
