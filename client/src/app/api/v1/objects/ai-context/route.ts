import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { aiContextQuerySchema } from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = aiContextQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      rootObjectId: searchParams.get("rootObjectId") ?? undefined,
    });

    await requireWorkspaceMember(query.workspaceId, user.userId);
    const result = await objectService.getAiContext({
      workspaceId: query.workspaceId,
      rootObjectId: query.rootObjectId,
    });
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
