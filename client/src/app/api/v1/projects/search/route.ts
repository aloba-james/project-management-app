import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { searchProjectsQuerySchema } from "@/validators/project.schema";
import * as floxProjectService from "@/domain/project/flox-project.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = searchProjectsQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      projectType: searchParams.get("projectType") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);
    const projects = await floxProjectService.searchProjects(query);
    return jsonOk({ projects, q: query.q });
  } catch (error) {
    return jsonError(error);
  }
}
