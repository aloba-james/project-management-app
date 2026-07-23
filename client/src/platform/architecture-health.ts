import { prisma } from "@/infra/db/prisma";
import { cache } from "@/infra/cache/memory";
import { storage } from "@/infra/storage/local-stub";
import { search } from "@/infra/search/postgres-keyword";
import { eventBus } from "@/platform/events/bus";

export type HealthItem = {
  name: string;
  layer: string;
  status: "live" | "stub" | "degraded";
  ok: boolean;
  detail?: string;
};

export async function getInfrastructureHealth(): Promise<HealthItem[]> {
  let postgres: HealthItem;
  try {
    await prisma.$queryRaw`SELECT 1`;
    postgres = {
      name: "postgresql",
      layer: "infrastructure",
      status: "live",
      ok: true,
      detail: "connected",
    };
  } catch (err) {
    postgres = {
      name: "postgresql",
      layer: "infrastructure",
      status: "degraded",
      ok: false,
      detail: err instanceof Error ? err.message : "unreachable",
    };
  }

  const [cacheHealth, storageHealth, searchHealth, busHealth] =
    await Promise.all([
      cache.health(),
      storage.health(),
      search.health(),
      eventBus.health(),
    ]);

  return [
    postgres,
    {
      name: cache.name,
      layer: "infrastructure",
      status: "stub",
      ok: cacheHealth.ok,
      detail: cacheHealth.detail,
    },
    {
      name: storage.name,
      layer: "infrastructure",
      status: "stub",
      ok: storageHealth.ok,
      detail: storageHealth.detail,
    },
    {
      name: search.name,
      layer: "infrastructure",
      status: searchHealth.ok ? "live" : "degraded",
      ok: searchHealth.ok,
      detail: searchHealth.detail,
    },
    {
      name: "event-bus",
      layer: "platform",
      status: busHealth.ok ? "live" : "degraded",
      ok: busHealth.ok,
      detail: busHealth.detail,
    },
  ];
}
