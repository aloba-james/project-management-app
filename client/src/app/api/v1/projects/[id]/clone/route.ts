import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceMember,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { cloneProjectSchema } from "@/validators/project.schema";
import * as floxProjectService from "@/domain/project/flox-project.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await floxProjectService.getProject(id);
    await requireWorkspaceMember(existing.workspaceId, user.userId);
    const body = cloneProjectSchema.parse(await request.json().catch(() => ({})));
    const targetWorkspaceId = body.targetWorkspaceId ?? existing.workspaceId;
    await requireWorkspaceWrite(targetWorkspaceId, user.userId);
    const project = await floxProjectService.cloneProject(id, user.userId, {
      targetWorkspaceId,
      name: body.name,
    });
    return jsonOk({ project }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
