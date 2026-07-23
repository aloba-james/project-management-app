import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { requireObjectAccess } from "@/lib/object-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { createRelationshipSchema } from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectAccess(id, user.userId, "View");
    const relationships = await objectService.listRelationships(id);
    return jsonOk({ relationships });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const { object: source } = await requireObjectAccess(id, user.userId, "Edit");
    const body = createRelationshipSchema.parse(await request.json());
    const relationship = await objectService.createRelationship({
      sourceId: source.id,
      sourceWorkspaceId: source.workspaceId,
      userId: user.userId,
      targetObjectId: body.targetObjectId,
      relationshipType: body.relationshipType,
    });
    return jsonOk({ relationship }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
