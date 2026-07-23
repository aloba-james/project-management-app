import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import {
  createWorkspaceSchema,
  listWorkspacesQuerySchema,
} from "@/validators/workspace.schema";
import * as workspaceService from "@/domain/workspace/workspace.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = listWorkspacesQuerySchema.parse({
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });

    const workspaces = await workspaceService.listWorkspaces(user.userId, query);
    return jsonOk({ workspaces });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createWorkspaceSchema.parse(await request.json());
    const workspace = await workspaceService.createWorkspace(user.userId, body);
    return jsonOk({ workspace }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
