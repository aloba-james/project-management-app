import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { requireObjectAccess } from "@/lib/object-auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import * as objectService from "@/domain/object/object.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    await requireObjectAccess(id, user.userId, "View");
    const activities = await objectService.listObjectActivity(id);
    return jsonOk({ activities });
  } catch (error) {
    return jsonError(error);
  }
}
