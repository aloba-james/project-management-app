import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceMember,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { updateWorkspaceSchema } from "@/validators/workspace.schema";
import * as workspaceService from "@/domain/workspace/workspace.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const membership = await requireWorkspaceMember(id, user.userId);
    const workspace = await workspaceService.getWorkspace(id, membership.role);
    return jsonOk({ workspace });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireWorkspaceWrite(id, user.userId);
    const body = updateWorkspaceSchema.parse(await request.json());
    const membership = await requireWorkspaceMember(id, user.userId);
    const workspace = await workspaceService.updateWorkspace(
      id,
      user.userId,
      body,
      membership.role,
    );
    return jsonOk({ workspace });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireWorkspaceWrite(id, user.userId);
    const membership = await requireWorkspaceMember(id, user.userId);
    const workspace = await workspaceService.softDeleteWorkspace(
      id,
      user.userId,
      membership.role,
    );
    return jsonOk({ workspace });
  } catch (error) {
    return jsonError(error);
  }
}
