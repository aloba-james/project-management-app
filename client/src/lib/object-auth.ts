import { prisma } from "@/lib/prisma";
import { AuthError, requireWorkspaceMember, ADMIN_ROLES } from "@/lib/workspace-auth";
import type { FloxObject, WorkspaceMemberRole } from "@/generated/prisma3";

export type ObjectPermissionAction =
  | "View"
  | "Comment"
  | "Edit"
  | "Delete"
  | "Share"
  | "Move"
  | "Archive";

const CREATOR_ACTIONS: ObjectPermissionAction[] = [
  "View",
  "Comment",
  "Edit",
  "Delete",
  "Share",
  "Move",
  "Archive",
];

export { CREATOR_ACTIONS };

export async function requireObjectAccess(
  objectId: string,
  userId: number,
  action?: ObjectPermissionAction,
) {
  const object = await prisma.floxObject.findUnique({
    where: { id: objectId },
  });
  if (!object || (object.deletedAt && action !== "View")) {
    throw new AuthError("Object not found", 404);
  }

  const membership = await requireWorkspaceMember(object.workspaceId, userId);

  if (ADMIN_ROLES.includes(membership.role as WorkspaceMemberRole)) {
    return { object, membership, isAdmin: true };
  }

  if (!action || action === "View") {
    // Workspace members can view non-deleted objects by default
    if (object.status === "Deleted" || object.deletedAt) {
      throw new AuthError("Object not found", 404);
    }
    return { object, membership, isAdmin: false };
  }

  const permission = await prisma.objectPermission.findUnique({
    where: { objectId_userId: { objectId, userId } },
  });

  if (!permission?.actions.includes(action)) {
    throw new AuthError("Forbidden", 403);
  }

  return { object, membership, isAdmin: false };
}

export async function requireObjectEdit(objectId: string, userId: number) {
  return requireObjectAccess(objectId, userId, "Edit");
}

export function serializeObject(object: FloxObject) {
  return {
    ...object,
    createdAt: object.createdAt.toISOString(),
    updatedAt: object.updatedAt.toISOString(),
    deletedAt: object.deletedAt?.toISOString() ?? null,
    metadata:
      object.metadata && typeof object.metadata === "object"
        ? object.metadata
        : {},
  };
}

export function buildObjectAiSummary(
  name: string,
  description?: string | null,
  objectType?: string,
): string {
  const desc = description?.trim();
  if (desc) {
    return `${objectType ?? "Object"} “${name}”: ${desc.slice(0, 240)}`;
  }
  return `${objectType ?? "Object"} named “${name}”.`;
}
