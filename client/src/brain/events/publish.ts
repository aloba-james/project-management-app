import { eventBus } from "@/platform/events/bus";
import type { Prisma } from "@/generated/prisma3";

/**
 * Publishes via the platform EventBus (persists BrainEvent + in-process fan-out).
 */
export async function publishBrainEvent(params: {
  workspaceId: string;
  executionId?: string | null;
  type: string;
  payload?: Prisma.InputJsonValue;
}) {
  return eventBus.publish(params.type, {
    workspaceId: params.workspaceId,
    executionId: params.executionId ?? null,
    payload: params.payload ?? {},
  });
}
