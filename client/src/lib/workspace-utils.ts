import { prisma } from "@/lib/prisma";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "workspace";
}

export async function uniqueSlug(baseName: string): Promise<string> {
  const base = slugify(baseName);
  let slug = base;
  let i = 0;
  while (await prisma.workspace.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function writeAuditLog(params: {
  workspaceId: string;
  userId: number;
  action: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.workspaceAuditLog.create({
    data: {
      workspaceId: params.workspaceId,
      userId: params.userId,
      action: params.action,
      metadata: params.metadata
        ? JSON.stringify(params.metadata)
        : undefined,
    },
  });
}

export function serializeWorkspace<T extends { createdAt: Date; updatedAt: Date; deletedAt: Date | null }>(
  workspace: T,
) {
  return {
    ...workspace,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
    deletedAt: workspace.deletedAt?.toISOString() ?? null,
  };
}
