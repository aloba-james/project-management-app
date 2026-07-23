import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const file = await fileService.duplicateFile(id, user.userId);
    return jsonOk({ file }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
