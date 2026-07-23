import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { suggestFoldersSchema } from "@/validators/folder.schema";
import * as folderService from "@/domain/folder/folder.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = suggestFoldersSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const suggestions = folderService.getSmartSuggestions(body.prompt);
    return jsonOk({ suggestions, prompt: body.prompt });
  } catch (error) {
    return jsonError(error);
  }
}
