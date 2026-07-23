import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import {
  requireObjectAccess,
  requireObjectEdit,
} from "@/lib/object-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { updateObjectSchema } from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectAccess(id, user.userId, "View");
    const object = await objectService.getObjectDetail(id);
    return jsonOk({ object });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectEdit(id, user.userId);
    const body = updateObjectSchema.parse(await request.json());
    const object = await objectService.updateObject(id, user.userId, body);
    return jsonOk({ object });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectAccess(id, user.userId, "Delete");
    const object = await objectService.deleteObject(id, user.userId);
    return jsonOk({ object });
  } catch (error) {
    return jsonError(error);
  }
}
