import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as workspaceService from "@/domain/workspace/workspace.service";

export async function POST(_request: NextRequest) {
  try {
    const user = await requireAppUser();
    const result = await workspaceService.ensurePersonalWorkspace(
      user.userId,
      user.username,
    );
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
