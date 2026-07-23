import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceMember(existing.workspaceId, user.userId);
    const versions = await fileService.listFileVersions(id);
    return jsonOk({ versions });
  } catch (error) {
    return jsonError(error);
  }
}
