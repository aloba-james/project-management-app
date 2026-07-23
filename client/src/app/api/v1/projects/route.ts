import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import {
  createProjectSchema,
  listProjectsQuerySchema,
} from "@/validators/project.schema";
import * as floxProjectService from "@/domain/project/flox-project.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = listProjectsQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      projectType: searchParams.get("projectType") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      includeDeleted: searchParams.get("includeDeleted") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);
    const projects = await floxProjectService.listProjects(query);
    return jsonOk({ projects });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createProjectSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const project = await floxProjectService.createProject(user.userId, body);
    return jsonOk({ project }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
