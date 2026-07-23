import { prisma } from "@/infra/db/prisma";
import { serializeObject } from "@/lib/object-auth";
import { requireWorkspaceId } from "@/platform/workspace-scope";

/**
 * Knowledge Graph facade — traverse ObjectRelationship / objects.
 */
export async function traverseFromRoot(params: {
  workspaceId: string;
  rootObjectId?: string | null;
  maxDepth?: number;
}) {
  const workspaceId = requireWorkspaceId(params.workspaceId);
  const maxDepth = params.maxDepth ?? 2;

  if (!params.rootObjectId) {
    const objects = await prisma.floxObject.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        status: { not: "Deleted" },
      },
      take: 40,
      orderBy: { updatedAt: "desc" },
    });
    return {
      nodes: objects.map(serializeObject),
      edges: [] as Array<{
        id: string;
        type: string;
        sourceId: string;
        targetId: string;
      }>,
    };
  }

  const visited = new Set<string>();
  const edges: Array<{
    id: string;
    type: string;
    sourceId: string;
    targetId: string;
  }> = [];
  let frontier = [params.rootObjectId];

  for (let depth = 0; depth < maxDepth && frontier.length; depth += 1) {
    const next: string[] = [];
    for (const id of frontier) {
      if (visited.has(id)) continue;
      visited.add(id);
      const rels = await prisma.objectRelationship.findMany({
        where: {
          workspaceId,
          OR: [{ sourceObjectId: id }, { targetObjectId: id }],
        },
      });
      for (const r of rels) {
        edges.push({
          id: String(r.id),
          type: r.relationshipType,
          sourceId: r.sourceObjectId,
          targetId: r.targetObjectId,
        });
        const other =
          r.sourceObjectId === id ? r.targetObjectId : r.sourceObjectId;
        if (!visited.has(other)) next.push(other);
      }
    }
    frontier = next;
  }

  const nodes = await prisma.floxObject.findMany({
    where: {
      id: { in: [...visited] },
      deletedAt: null,
      status: { not: "Deleted" },
    },
  });

  return {
    nodes: nodes.map(serializeObject),
    edges,
  };
}

export const knowledgeGraph = {
  name: "knowledge-graph",
  traverseFromRoot,
  async health() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { ok: true, detail: "ObjectRelationship traversal" };
    } catch {
      return { ok: false, detail: "database unreachable" };
    }
  },
};
