import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import {
  createFolderSchema,
  listFoldersQuerySchema,
} from "@/validators/folder.schema";
import * as folderService from "@/domain/folder/folder.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const parentRaw = searchParams.get("parentFolderId");
    const query = listFoldersQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      projectId: searchParams.get("projectId") ?? undefined,
      parentFolderId:
        parentRaw === null || parentRaw === "" || parentRaw === "null"
          ? null
          : parentRaw,
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      rootOnly: searchParams.get("rootOnly") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);
    const folders = await folderService.listFolders(query);
    return jsonOk({ folders });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createFolderSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const folder = await folderService.createFolder(user.userId, body);
    return jsonOk({ folder }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
