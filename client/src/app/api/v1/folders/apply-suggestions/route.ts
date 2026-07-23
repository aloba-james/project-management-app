import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { applyFolderSuggestionsSchema } from "@/validators/folder.schema";
import * as folderService from "@/domain/folder/folder.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = applyFolderSuggestionsSchema.parse(await request.json());
    await requireWorkspaceWrite(body.workspaceId, user.userId);
    const folders = await folderService.createFoldersFromBlueprint(
      user.userId,
      {
        workspaceId: body.workspaceId,
        projectId: body.projectId,
        parentFolderId: body.parentFolderId ?? null,
        folders: body.folders.map((f) => ({
          name: f.name,
          folderType: f.folderType ?? "General",
          children: f.children?.map((c) => ({
            name: c.name,
            folderType: c.folderType ?? "General",
          })),
        })),
      },
    );
    return jsonOk({ folders }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
