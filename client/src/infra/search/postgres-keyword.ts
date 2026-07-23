import { prisma } from "@/infra/db/prisma";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import type { ObjectType, Prisma } from "@/generated/prisma3";
import { serializeObject } from "@/lib/object-auth";

export type SearchAdapter = {
  name: string;
  searchObjects(params: {
    workspaceId: string;
    q: string;
    objectType?: ObjectType;
  }): Promise<ReturnType<typeof serializeObject>[]>;
  health(): Promise<{ ok: boolean; detail?: string }>;
};

export class PostgresKeywordSearch implements SearchAdapter {
  name = "postgres-keyword-search";

  async searchObjects(params: {
    workspaceId: string;
    q: string;
    objectType?: ObjectType;
  }) {
    const workspaceId = requireWorkspaceId(params.workspaceId);
    const where: Prisma.FloxObjectWhereInput = {
      workspaceId,
      deletedAt: null,
      status: { not: "Deleted" },
      ...(params.objectType ? { objectType: params.objectType } : {}),
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { description: { contains: params.q, mode: "insensitive" } },
        { aiSummary: { contains: params.q, mode: "insensitive" } },
        { tags: { has: params.q } },
      ],
    };

    const objects = await prisma.floxObject.findMany({
      where,
      take: 50,
      orderBy: { updatedAt: "desc" },
    });
    return objects.map(serializeObject);
  }

  async health() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { ok: true, detail: "keyword search via PostgreSQL" };
    } catch {
      return { ok: false, detail: "database unreachable" };
    }
  }
}

const globalForSearch = globalThis as unknown as {
  searchAdapter: SearchAdapter | undefined;
};

export const search: SearchAdapter =
  globalForSearch.searchAdapter ?? new PostgresKeywordSearch();

if (process.env.NODE_ENV !== "production") {
  globalForSearch.searchAdapter = search;
}
