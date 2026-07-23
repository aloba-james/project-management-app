import { prisma } from "@/infra/db/prisma";
import { AuthError, ADMIN_ROLES } from "@/lib/workspace-auth";
import {
  buildObjectAiSummary,
  CREATOR_ACTIONS,
  serializeObject,
} from "@/lib/object-auth";
import { writeObjectActivity } from "@/lib/object-activity";
import { search as searchAdapter } from "@/infra/search/postgres-keyword";
import { eventBus, PlatformEvents } from "@/platform";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import type {
  ObjectRelationshipType,
  Prisma,
  WorkspaceMemberRole,
} from "@/generated/prisma3";
import type {
  CreateObjectInput,
  UpdateObjectInput,
} from "@/validators/object.schema";

export type ListObjectsQuery = {
  workspaceId: string;
  objectType?: CreateObjectInput["objectType"];
  status?: UpdateObjectInput["status"];
  q?: string;
  includeDeleted?: boolean;
};

export async function listObjects(query: ListObjectsQuery) {
  const workspaceId = requireWorkspaceId(query.workspaceId);
  const where: Prisma.FloxObjectWhereInput = {
    workspaceId,
    ...(query.objectType ? { objectType: query.objectType } : {}),
    ...(query.status
      ? { status: query.status }
      : query.includeDeleted
        ? {}
        : { status: { not: "Deleted" }, deletedAt: null }),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
            { aiSummary: { contains: query.q, mode: "insensitive" } },
            { tags: { has: query.q } },
          ],
        }
      : {}),
  };

  const objects = await prisma.floxObject.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return objects.map(serializeObject);
}

export async function createObject(userId: number, body: CreateObjectInput) {
  const workspaceId = requireWorkspaceId(body.workspaceId);
  const aiSummary = buildObjectAiSummary(
    body.name,
    body.description,
    body.objectType,
  );

  const object = await prisma.$transaction(async (tx) => {
    const created = await tx.floxObject.create({
      data: {
        workspaceId,
        objectType: body.objectType,
        name: body.name,
        description: body.description ?? null,
        status: body.status,
        createdBy: userId,
        updatedBy: userId,
        tags: body.tags,
        metadata: body.metadata as Prisma.InputJsonValue,
        aiSummary,
      },
    });

    await tx.objectPermission.create({
      data: {
        objectId: created.id,
        userId,
        actions: CREATOR_ACTIONS,
      },
    });

    return created;
  });

  await writeObjectActivity({
    objectId: object.id,
    workspaceId: object.workspaceId,
    userId,
    activityType: "Created",
    metadata: { name: object.name, objectType: object.objectType },
  });

  await eventBus.publish(PlatformEvents.ObjectCreated, {
    workspaceId: object.workspaceId,
    payload: { objectId: object.id, objectType: object.objectType },
  });

  return serializeObject(object);
}

export async function getObjectDetail(id: string) {
  const object = await prisma.floxObject.findUniqueOrThrow({
    where: { id },
    include: {
      outboundRels: {
        include: { target: true },
        take: 50,
      },
      inboundRels: {
        include: { source: true },
        take: 50,
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          user: { select: { userId: true, username: true } },
        },
      },
      permissions: {
        include: {
          user: {
            select: {
              userId: true,
              username: true,
              email: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });

  return {
    ...serializeObject(object),
    relationships: {
      outbound: object.outboundRels.map((r) => ({
        id: r.id,
        relationshipType: r.relationshipType,
        createdAt: r.createdAt.toISOString(),
        target: serializeObject(r.target),
      })),
      inbound: object.inboundRels.map((r) => ({
        id: r.id,
        relationshipType: r.relationshipType,
        createdAt: r.createdAt.toISOString(),
        source: serializeObject(r.source),
      })),
    },
    activities: object.activities.map((a) => ({
      id: a.id,
      activityType: a.activityType,
      metadata: a.metadata,
      createdAt: a.createdAt.toISOString(),
      user: a.user,
    })),
    permissions: object.permissions.map((p) => ({
      id: p.id,
      userId: p.userId,
      actions: p.actions,
      user: p.user,
    })),
  };
}

export async function updateObject(
  id: string,
  userId: number,
  body: UpdateObjectInput,
) {
  const existing = await prisma.floxObject.findUniqueOrThrow({
    where: { id },
  });

  const nextName = body.name ?? existing.name;
  const nextDescription =
    body.description !== undefined ? body.description : existing.description;
  const nextType = existing.objectType;

  const object = await prisma.floxObject.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.tags !== undefined ? { tags: body.tags } : {}),
      ...(body.metadata !== undefined
        ? { metadata: body.metadata as Prisma.InputJsonValue }
        : {}),
      ...(body.aiSummary !== undefined
        ? { aiSummary: body.aiSummary }
        : {
            aiSummary: buildObjectAiSummary(
              nextName,
              nextDescription,
              nextType,
            ),
          }),
      updatedBy: userId,
      ...(body.status === "Deleted"
        ? { deletedAt: new Date() }
        : body.status !== undefined
          ? { deletedAt: null }
          : {}),
    },
  });

  const activityType =
    body.status === "Archived"
      ? ("Archived" as const)
      : body.status === "Deleted"
        ? ("Deleted" as const)
        : ("Updated" as const);

  await writeObjectActivity({
    objectId: id,
    workspaceId: object.workspaceId,
    userId,
    activityType,
    metadata: JSON.parse(JSON.stringify(body)) as Prisma.InputJsonValue,
  });

  await eventBus.publish(
    body.status === "Deleted"
      ? PlatformEvents.ObjectDeleted
      : PlatformEvents.ObjectUpdated,
    {
      workspaceId: object.workspaceId,
      payload: { objectId: id, ...body },
    },
  );

  return serializeObject(object);
}

export async function deleteObject(id: string, userId: number) {
  const object = await prisma.floxObject.update({
    where: { id },
    data: {
      status: "Deleted",
      deletedAt: new Date(),
      updatedBy: userId,
    },
  });

  await writeObjectActivity({
    objectId: id,
    workspaceId: object.workspaceId,
    userId,
    activityType: "Deleted",
  });

  await eventBus.publish(PlatformEvents.ObjectDeleted, {
    workspaceId: object.workspaceId,
    payload: { objectId: id },
  });

  return serializeObject(object);
}

export async function searchObjects(params: {
  workspaceId: string;
  q: string;
  objectType?: CreateObjectInput["objectType"];
}) {
  const workspaceId = requireWorkspaceId(params.workspaceId);
  const objects = await searchAdapter.searchObjects({
    workspaceId,
    q: params.q,
    objectType: params.objectType,
  });

  const qLower = params.q.toLowerCase();
  return [...objects].sort((a, b) => {
    const aName = a.name.toLowerCase().includes(qLower) ? 0 : 1;
    const bName = b.name.toLowerCase().includes(qLower) ? 0 : 1;
    return aName - bName;
  });
}

export async function listRelationships(objectId: string) {
  const [outbound, inbound] = await Promise.all([
    prisma.objectRelationship.findMany({
      where: { sourceObjectId: objectId },
      include: { target: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.objectRelationship.findMany({
      where: { targetObjectId: objectId },
      include: { source: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    outbound: outbound.map((r) => ({
      id: r.id,
      relationshipType: r.relationshipType,
      createdAt: r.createdAt.toISOString(),
      target: serializeObject(r.target),
    })),
    inbound: inbound.map((r) => ({
      id: r.id,
      relationshipType: r.relationshipType,
      createdAt: r.createdAt.toISOString(),
      source: serializeObject(r.source),
    })),
  };
}

export async function createRelationship(params: {
  sourceId: string;
  sourceWorkspaceId: string;
  userId: number;
  targetObjectId: string;
  relationshipType: ObjectRelationshipType;
}) {
  const target = await prisma.floxObject.findUnique({
    where: { id: params.targetObjectId },
  });
  if (!target || target.workspaceId !== params.sourceWorkspaceId) {
    throw new AuthError(
      "Target object must exist in the same workspace",
      400,
    );
  }
  if (target.id === params.sourceId) {
    throw new AuthError("Cannot relate an object to itself", 400);
  }

  const relationship = await prisma.objectRelationship.create({
    data: {
      workspaceId: params.sourceWorkspaceId,
      sourceObjectId: params.sourceId,
      targetObjectId: target.id,
      relationshipType: params.relationshipType,
    },
    include: { target: true },
  });

  await writeObjectActivity({
    objectId: params.sourceId,
    workspaceId: params.sourceWorkspaceId,
    userId: params.userId,
    activityType: "Referenced",
    metadata: {
      relationshipType: params.relationshipType,
      targetObjectId: target.id,
    },
  });

  return {
    id: relationship.id,
    relationshipType: relationship.relationshipType,
    createdAt: relationship.createdAt.toISOString(),
    target: serializeObject(relationship.target),
  };
}

export async function listObjectActivity(objectId: string) {
  const activities = await prisma.objectActivity.findMany({
    where: { objectId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { userId: true, username: true } },
    },
  });

  return activities.map((a) => ({
    id: a.id,
    activityType: a.activityType,
    metadata: a.metadata,
    createdAt: a.createdAt.toISOString(),
    user: a.user,
  }));
}

export async function listPermissions(objectId: string) {
  const permissions = await prisma.objectPermission.findMany({
    where: { objectId },
    include: {
      user: {
        select: {
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
    },
  });

  return permissions.map((p) => ({
    id: p.id,
    userId: p.userId,
    actions: p.actions,
    user: p.user,
  }));
}

export async function upsertPermission(params: {
  objectId: string;
  workspaceId: string;
  actorUserId: number;
  targetUserId: number;
  actions: string[];
  membershipRole: WorkspaceMemberRole;
  isAdmin: boolean;
}) {
  const canShare =
    params.isAdmin ||
    ADMIN_ROLES.includes(params.membershipRole) ||
    (
      await prisma.objectPermission.findUnique({
        where: {
          objectId_userId: {
            objectId: params.objectId,
            userId: params.actorUserId,
          },
        },
      })
    )?.actions.includes("Share");

  if (!canShare) {
    throw new AuthError("Forbidden", 403);
  }

  const permission = await prisma.objectPermission.upsert({
    where: {
      objectId_userId: {
        objectId: params.objectId,
        userId: params.targetUserId,
      },
    },
    create: {
      objectId: params.objectId,
      userId: params.targetUserId,
      actions: params.actions,
    },
    update: {
      actions: params.actions,
    },
    include: {
      user: {
        select: {
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
    },
  });

  await writeObjectActivity({
    objectId: params.objectId,
    workspaceId: params.workspaceId,
    userId: params.actorUserId,
    activityType: "Shared",
    metadata: { userId: params.targetUserId, actions: params.actions },
  });

  return {
    id: permission.id,
    userId: permission.userId,
    actions: permission.actions,
    user: permission.user,
  };
}

export async function getAiContext(params: {
  workspaceId: string;
  rootObjectId?: string | null;
}) {
  const workspaceId = requireWorkspaceId(params.workspaceId);

  if (params.rootObjectId) {
    const root = await prisma.floxObject.findFirst({
      where: {
        id: params.rootObjectId,
        workspaceId,
        deletedAt: null,
        status: { not: "Deleted" },
      },
    });
    if (!root) {
      return { objects: [] as ReturnType<typeof serializeObject>[], rootObjectId: undefined };
    }

    const rels = await prisma.objectRelationship.findMany({
      where: {
        workspaceId,
        OR: [
          { sourceObjectId: root.id },
          { targetObjectId: root.id },
        ],
        relationshipType: {
          in: ["contains", "belongs_to", "related_to", "references"],
        },
      },
    });

    const relatedIds = new Set<string>([root.id]);
    for (const r of rels) {
      relatedIds.add(r.sourceObjectId);
      relatedIds.add(r.targetObjectId);
    }

    const objects = await prisma.floxObject.findMany({
      where: {
        id: { in: [...relatedIds] },
        deletedAt: null,
        status: { not: "Deleted" },
      },
    });

    return {
      objects: objects.map(serializeObject),
      rootObjectId: root.id,
    };
  }

  const objects = await prisma.floxObject.findMany({
    where: {
      workspaceId,
      deletedAt: null,
      status: { not: "Deleted" },
    },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  return { objects: objects.map(serializeObject) };
}
