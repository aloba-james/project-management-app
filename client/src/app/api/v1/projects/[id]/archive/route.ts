import { NextRequest } from "next/server";
import {
  requireAppUser,
  requireWorkspaceWrite,
} from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as floxProjectService from "@/domain/project/flox-project.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await floxProjectService.getProject(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const project = await floxProjectService.archiveProject(id);
    return jsonOk({ project });
  } catch (error) {
    return jsonError(error);
  }
}
