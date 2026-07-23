import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { fileRelationshipSchema } from "@/validators/file.schema";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = fileRelationshipSchema.parse(await request.json());
    const relationship = await fileService.addFileRelationship(
      id,
      user.userId,
      body,
    );
    return jsonOk({ relationship }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
