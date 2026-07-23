import { prisma } from "@/lib/prisma";
import type { ObjectActivityType, Prisma } from "@/generated/prisma3";

export async function writeObjectActivity(params: {
  objectId: string;
  workspaceId: string;
  userId?: number | null;
  activityType: ObjectActivityType;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.objectActivity.create({
    data: {
      objectId: params.objectId,
      workspaceId: params.workspaceId,
      userId: params.userId ?? null,
      activityType: params.activityType,
      metadata: params.metadata ?? undefined,
    },
  });
}
