import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { searchObjectsQuerySchema } from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = searchObjectsQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      objectType: searchParams.get("objectType") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      includeDeleted: searchParams.get("includeDeleted") ?? undefined,
    });

    await requireWorkspaceMember(query.workspaceId, user.userId);
    const objects = await objectService.searchObjects({
      workspaceId: query.workspaceId,
      q: query.q,
      objectType: query.objectType,
    });
    return jsonOk({ objects, q: query.q });
  } catch (error) {
    return jsonError(error);
  }
}
