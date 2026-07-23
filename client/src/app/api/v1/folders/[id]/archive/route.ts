import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as folderService from "@/domain/folder/folder.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await folderService.getFolder(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const folder = await folderService.archiveFolder(id);
    return jsonOk({ folder });
  } catch (error) {
    return jsonError(error);
  }
}
