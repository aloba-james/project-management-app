import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { brainGateway } from "@/ai/brain/gateway";
import { jsonError, jsonOk } from "@/lib/api-response";
import { z } from "zod";

const querySchema = z.object({
  workspaceId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
    });
    await requireWorkspaceMember(query.workspaceId, user.userId);

    const executions = await brainGateway.listExecutions(query.workspaceId);
    return jsonOk({ executions });
  } catch (error) {
    return jsonError(error);
  }
}
