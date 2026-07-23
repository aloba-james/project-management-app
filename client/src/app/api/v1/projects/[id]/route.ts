import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceMember,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { updateProjectSchema } from "@/validators/project.schema";
import * as floxProjectService from "@/domain/project/flox-project.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const project = await floxProjectService.getProject(id);
    await requireWorkspaceMember(project.workspaceId, user.userId);
    return jsonOk({ project });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await floxProjectService.getProject(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = updateProjectSchema.parse(await request.json());
    const project = await floxProjectService.updateProject(
      id,
      user.userId,
      body,
    );
    return jsonOk({ project });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await floxProjectService.getProject(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const project = await floxProjectService.softDeleteProject(id, user.userId);
    return jsonOk({ project });
  } catch (error) {
    return jsonError(error);
  }
}
