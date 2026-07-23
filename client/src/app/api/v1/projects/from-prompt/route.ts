import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { fromPromptSchema } from "@/validators/project.schema";
import * as floxProjectService from "@/domain/project/flox-project.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = fromPromptSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const project = await floxProjectService.createProjectFromPrompt(
      user.userId,
      body,
    );
    return jsonOk({ project }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
