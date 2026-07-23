import { NextRequest } from "next/server";
import { requireAppUser, requireWorkspaceMember } from "@/lib/workspace-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import {
  createObjectSchema,
  listObjectsQuerySchema,
} from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const { searchParams } = new URL(request.url);
    const query = listObjectsQuerySchema.parse({
      workspaceId: searchParams.get("workspaceId") ?? undefined,
      objectType: searchParams.get("objectType") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      includeDeleted: searchParams.get("includeDeleted") ?? undefined,
    });

    await requireWorkspaceMember(query.workspaceId, user.userId);
    const objects = await objectService.listObjects(query);
    return jsonOk({ objects });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAppUser();
    const body = createObjectSchema.parse(await request.json());
    await requireWorkspaceMember(body.workspaceId, user.userId);
    const object = await objectService.createObject(user.userId, body);
    return jsonOk({ object }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
