import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceMember,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { updateFileSchema } from "@/validators/file.schema";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const file = await fileService.getFile(id);
    await requireWorkspaceMember(file.workspaceId, user.userId);
    return jsonOk({ file });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = updateFileSchema.parse(await request.json());
    const file = await fileService.updateFile(id, user.userId, body);
    return jsonOk({ file });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const file = await fileService.softDeleteFile(id, user.userId);
    return jsonOk({ file });
  } catch (error) {
    return jsonError(error);
  }
}
