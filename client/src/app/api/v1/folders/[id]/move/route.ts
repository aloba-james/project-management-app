import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { moveFolderSchema } from "@/validators/folder.schema";
import * as folderService from "@/domain/folder/folder.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await folderService.getFolder(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = moveFolderSchema.parse(await request.json());
    const folder = await folderService.moveFolder(id, body.parentFolderId ?? null);
    return jsonOk({ folder });
  } catch (error) {
    return jsonError(error);
  }
}
