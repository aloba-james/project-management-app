import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { requireObjectAccess } from "@/lib/object-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { upsertPermissionsSchema } from "@/validators/object.schema";
import * as objectService from "@/domain/object/object.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectAccess(id, user.userId, "View");
    const permissions = await objectService.listPermissions(id);
    return jsonOk({ permissions });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const { object, membership, isAdmin } = await requireObjectAccess(
      id,
      user.userId,
      "View",
    );
    const body = upsertPermissionsSchema.parse(await request.json());
    const permission = await objectService.upsertPermission({
      objectId: id,
      workspaceId: object.workspaceId,
      actorUserId: user.userId,
      targetUserId: body.userId,
      actions: body.actions,
      membershipRole: membership.role,
      isAdmin,
    });
    return jsonOk({ permission });
  } catch (error) {
    return jsonError(error);
  }
}
