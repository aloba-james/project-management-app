import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { brainGateway } from "@/ai/brain/gateway";
import { jsonError, jsonOk } from "@/lib/api-response";
import { brainSearchSchema } from "@/validators/brain.schema";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = brainSearchSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);

    const result = await brainGateway.search({
      workspaceId: body.workspaceId,
      q: body.q,
    });

    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
