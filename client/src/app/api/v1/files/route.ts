import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import {
  createFileSchema,
  listFilesQuerySchema,
} from "@/validators/file.schema";
import * as fileService from "@/domain/file/file.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const folderRaw = searchParams.get("folderId");
    const query = listFilesQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      projectId: searchParams.get("projectId") ?? undefined,
      folderId:
        folderRaw === null || folderRaw === "" || folderRaw === "null"
          ? folderRaw === "null" || folderRaw === ""
            ? null
            : undefined
          : folderRaw,
      status: searchParams.get("status") ?? undefined,
      fileKind: searchParams.get("fileKind") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);
    const files = await fileService.listFiles(query);
    return jsonOk({ files });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createFileSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const file = await fileService.createFile(user.userId, body);
    return jsonOk({ file }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
