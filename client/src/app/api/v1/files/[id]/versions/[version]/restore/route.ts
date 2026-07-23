import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceWrite } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { z } from "zod";
import * as fileService from "@/domain/file/file.service";

type Params = { params: Promise<{ id: string; version: string }> };

const paramsSchema = z.object({
  version: z.coerce.number().int().positive(),
});

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id, version: versionRaw } = await params;
    const { version } = paramsSchema.parse({ version: versionRaw });
    const existing = await fileService.getFile(id);
    await requireWorkspaceWrite(existing.workspaceId, user.userId);
    const file = await fileService.restoreFileVersion(id, version, user.userId);
    return jsonOk({ file });
  } catch (error) {
    return jsonError(error);
  }
}
