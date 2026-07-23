import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceAdmin } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as workspaceService from "@/domain/workspace/workspace.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const membership = await requireWorkspaceAdmin(id, user.userId);
    const workspace = await workspaceService.archiveWorkspace(
      id,
      user.userId,
      membership.role,
      membership.workspace.status,
    );
    return jsonOk({ workspace });
  } catch (error) {
    return jsonError(error);
  }
}
