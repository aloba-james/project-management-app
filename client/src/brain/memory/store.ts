import { prisma } from "@/lib/prisma";
import type { BrainMemoryScope, Prisma } from "@/generated/prisma3";

function ownerKey(scope: BrainMemoryScope, userId?: number | null) {
  return scope === "workspace" ? "workspace" : `user:${userId ?? 0}`;
}

export async function getMemoryMap(
  workspaceId: string,
  userId: number,
): Promise<Record<string, unknown>> {
  const rows = await prisma.brainMemory.findMany({
    where: {
      workspaceId,
      OR: [
        { scope: "workspace", ownerKey: "workspace" },
        { scope: "user", ownerKey: `user:${userId}` },
      ],
    },
  });

  const map: Record<string, unknown> = {};
  for (const row of rows) {
    map[`${row.scope}:${row.key}`] = row.value;
  }
  return map;
}

export async function setMemory(params: {
  workspaceId: string;
  userId?: number | null;
  scope: BrainMemoryScope;
  key: string;
  value: Prisma.InputJsonValue;
}) {
  const ok = ownerKey(params.scope, params.userId);
  return prisma.brainMemory.upsert({
    where: {
      workspaceId_ownerKey_key: {
        workspaceId: params.workspaceId,
        ownerKey: ok,
        key: params.key,
      },
    },
    create: {
      workspaceId: params.workspaceId,
      userId: params.scope === "user" ? params.userId ?? null : null,
      scope: params.scope,
      ownerKey: ok,
      key: params.key,
      value: params.value,
    },
    update: {
      value: params.value,
    },
  });
}
