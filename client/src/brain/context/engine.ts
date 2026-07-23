import { prisma } from "@/lib/prisma";
import { getMemoryMap } from "@/brain/memory/store";
import type { BrainContextBundle } from "@/brain/types";
import type { ObjectType } from "@/generated/prisma3";

const CONTEXT_TYPES: ObjectType[] = [
  "Project",
  "Folder",
  "File",
  "Template",
  "Knowledge",
  "Task",
  "Meeting",
  "Prompt",
  "Repository",
];

export async function gatherContext(params: {
  workspaceId: string;
  userId: number;
  rootObjectId?: string | null;
  prompt?: string;
}): Promise<BrainContextBundle> {
  const { workspaceId, userId, rootObjectId, prompt } = params;

  let objects = await prisma.floxObject.findMany({
    where: {
      workspaceId,
      deletedAt: null,
      status: { not: "Deleted" },
      objectType: { in: CONTEXT_TYPES },
      ...(prompt
        ? {
            OR: [
              { name: { contains: prompt.slice(0, 40), mode: "insensitive" } },
              {
                description: {
                  contains: prompt.slice(0, 40),
                  mode: "insensitive",
                },
              },
              { tags: { hasSome: prompt.toLowerCase().split(/\s+/).slice(0, 5) } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 25,
  });

  if (rootObjectId) {
    const root = await prisma.floxObject.findFirst({
      where: {
        id: rootObjectId,
        workspaceId,
        deletedAt: null,
      },
    });
    if (root && !objects.some((o) => o.id === root.id)) {
      objects = [root, ...objects].slice(0, 25);
    }

    const rels = await prisma.objectRelationship.findMany({
      where: {
        workspaceId,
        OR: [
          { sourceObjectId: rootObjectId },
          { targetObjectId: rootObjectId },
        ],
      },
      include: { source: true, target: true },
      take: 20,
    });
    for (const r of rels) {
      for (const obj of [r.source, r.target]) {
        if (
          obj.workspaceId === workspaceId &&
          !objects.some((o) => o.id === obj.id)
        ) {
          objects.push(obj);
        }
      }
    }
    objects = objects.slice(0, 40);
  }

  // Fallback: recent objects if keyword search empty
  if (objects.length === 0) {
    objects = await prisma.floxObject.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        status: { not: "Deleted" },
      },
      orderBy: { updatedAt: "desc" },
      take: 15,
    });
  }

  const memory = await getMemoryMap(workspaceId, userId);

  return {
    workspaceId,
    rootObjectId: rootObjectId ?? null,
    objects,
    memory,
    objectIds: objects.map((o) => o.id),
  };
}
