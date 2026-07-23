import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceMember,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { updateFolderSchema } from "@/validators/folder.schema";
import * as folderService from "@/domain/folder/folder.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const folder = await folderService.getFolder(id);
    await requireWorkspaceMember(folder.workspaceId, user.userId);
    return jsonOk({ folder });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await folderService.getFolder(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = updateFolderSchema.parse(await request.json());
    const folder = await folderService.updateFolder(id, user.userId, body);
    return jsonOk({ folder });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await folderService.getFolder(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const folder = await folderService.deleteFolder(id, user.userId);
    return jsonOk({ folder });
  } catch (error) {
    return jsonError(error);
  }
}
