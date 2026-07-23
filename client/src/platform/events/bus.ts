import { prisma } from "@/infra/db/prisma";
import type { PlatformEvent, PlatformEventName } from "./types";

export type EventHandler<T = unknown> = (
  event: PlatformEvent<T>,
) => void | Promise<void>;

export interface EventBus {
  publish<T = unknown>(
    type: PlatformEventName | string,
    params: {
      workspaceId: string;
      payload: T;
      executionId?: string | null;
    },
  ): Promise<PlatformEvent<T>>;
  subscribe<T = unknown>(
    type: PlatformEventName | string | "*",
    handler: EventHandler<T>,
  ): () => void;
  health(): Promise<{ ok: boolean; detail?: string }>;
}

type HandlerEntry = {
  type: string;
  handler: EventHandler;
};

/**
 * Persists events to BrainEvent and fans out to in-process subscribers.
 */
export class PrismaEventBus implements EventBus {
  private handlers: HandlerEntry[] = [];

  async publish<T = unknown>(
    type: PlatformEventName | string,
    params: {
      workspaceId: string;
      payload: T;
      executionId?: string | null;
    },
  ): Promise<PlatformEvent<T>> {
    const event: PlatformEvent<T> = {
      type,
      workspaceId: params.workspaceId,
      payload: params.payload,
      executionId: params.executionId ?? null,
      occurredAt: new Date().toISOString(),
    };

    await prisma.brainEvent.create({
      data: {
        workspaceId: params.workspaceId,
        executionId: params.executionId ?? null,
        type,
        payload: params.payload as object,
      },
    });

    const matching = this.handlers.filter(
      (h) => h.type === "*" || h.type === type,
    );
    await Promise.all(
      matching.map(async (h) => {
        try {
          await h.handler(event as PlatformEvent);
        } catch (err) {
          console.error(`[EventBus] handler error for ${type}:`, err);
        }
      }),
    );

    return event;
  }

  subscribe<T = unknown>(
    type: PlatformEventName | string | "*",
    handler: EventHandler<T>,
  ): () => void {
    const entry: HandlerEntry = {
      type,
      handler: handler as EventHandler,
    };
    this.handlers.push(entry);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== entry);
    };
  }

  async health() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        ok: true,
        detail: `PrismaEventBus; subscribers=${this.handlers.length}`,
      };
    } catch {
      return { ok: false, detail: "database unreachable" };
    }
  }
}

const globalForBus = globalThis as unknown as {
  eventBus: EventBus | undefined;
};

export const eventBus: EventBus =
  globalForBus.eventBus ?? new PrismaEventBus();

if (process.env.NODE_ENV !== "production") {
  globalForBus.eventBus = eventBus;
}
