import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { brainGateway } from "@/ai/brain/gateway";
import { jsonError, jsonOk } from "@/lib/api-response";
import { brainContextSchema } from "@/validators/brain.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = brainContextSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);

    const context = await brainGateway.context({
      workspaceId: body.workspaceId,
      userId: user.userId,
      rootObjectId: body.rootObjectId,
      prompt: body.prompt,
    });

    return jsonOk({ context });
  } catch (error) {
    return jsonError(error);
  }
}
