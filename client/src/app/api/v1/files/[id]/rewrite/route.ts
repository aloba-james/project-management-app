import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { rewriteFileSchema } from "@/validators/file.schema";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const body = rewriteFileSchema.parse(
      await request.json().catch(() => ({})),
    );
    const file = await fileService.rewriteFileContent(
      id,
      user.userId,
      body.instruction,
    );
    return jsonOk({ file });
  } catch (error) {
    return jsonError(error);
  }
}
