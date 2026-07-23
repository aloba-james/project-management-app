import { prisma } from "@/infra/db/prisma";
import { AuthError } from "@/lib/workspace-auth";
import { CREATOR_ACTIONS } from "@/lib/object-auth";
import { slugify } from "@/lib/workspace-utils";
import { eventBus, PlatformEvents } from "@/platform";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import type {
  CreateFolderInput,
  UpdateFolderInput,
} from "@/validators/folder.schema";
import type {
  FolderStatus,
  FolderType,
  Prisma,
} from "@/generated/prisma3";
import type { BlueprintFolder } from "@/domain/project/blueprints";
import { suggestFolderTree } from "@/domain/project/blueprints";

function buildFolderAiSummary(
  name: string,
  description: string | null | undefined,
  folderType: FolderType,
) {
  const desc = description?.trim();
  if (desc) {
    return `This ${folderType.toLowerCase()} folder “${name}” ${desc.slice(0, 180)}${desc.length > 180 ? "…" : ""}`;
  }
  return `This ${folderType.toLowerCase()} folder “${name}” organizes related project context and objects.`;
}

export function serializeFolder<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count?: { children?: number; objects?: number };
  },
>(folder: T) {
  return {
    ...folder,
    createdAt: folder.createdAt.toISOString(),
    updatedAt: folder.updatedAt.toISOString(),
    deletedAt: folder.deletedAt?.toISOString() ?? null,
    childCount: folder._count?.children ?? undefined,
    objectCount: folder._count?.objects ?? undefined,
  };
}

async function uniqueFolderSlug(
  projectId: string,
  parentFolderId: string | null,
  baseName: string,
) {
  const base = slugify(baseName) || "folder";
  let slug = base;
  let i = 0;
  while (true) {
    const existing = await prisma.floxFolder.findFirst({
      where: {
        projectId,
        parentFolderId,
        slug,
        status: { not: "Deleted" },
      },
    });
    if (!existing) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

async function assertProjectInWorkspace(projectId: string, workspaceId: string) {
  const project = await prisma.floxProject.findFirst({
    where: {
      id: projectId,
      workspaceId,
      deletedAt: null,
      status: { not: "Deleted" },
    },
  });
  if (!project) throw new AuthError("Project not found", 404);
  return project;
}

export async function createFolder(userId: number, body: CreateFolderInput) {
  const workspaceId = requireWorkspaceId(body.workspaceId);
  await assertProjectInWorkspace(body.projectId, workspaceId);

  if (body.parentFolderId) {
    const parent = await prisma.floxFolder.findFirst({
      where: {
        id: body.parentFolderId,
        projectId: body.projectId,
        workspaceId,
        status: { not: "Deleted" },
      },
    });
    if (!parent) throw new AuthError("Parent folder not found", 404);
    if (parent.isLocked) {
      throw new AuthError("Cannot create inside a locked folder", 400);
    }
  }

  const slug = await uniqueFolderSlug(
    body.projectId,
    body.parentFolderId ?? null,
    body.name,
  );
  const folderType = body.folderType ?? "General";
  const status = body.status ?? "Active";
  const aiSummary = buildFolderAiSummary(
    body.name,
    body.description,
    folderType,
  );

  const folder = await prisma.$transaction(async (tx) => {
    const created = await tx.floxFolder.create({
      data: {
        workspaceId,
        projectId: body.projectId,
        parentFolderId: body.parentFolderId ?? null,
        name: body.name,
        slug,
        description: body.description ?? null,
        icon: body.icon ?? null,
        color: body.color ?? null,
        status,
        folderType,
        ownerId: userId,
        aiSummary,
        metadata: (body.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
    const object = await tx.floxObject.create({
      data: {
        workspaceId,
        folderId: created.id,
        objectType: "Folder",
        name: created.name,
        description: created.description,
        status: "Active",
        createdBy: userId,
        updatedBy: userId,
        aiSummary,
        metadata: {
          floxFolderId: created.id,
          floxProjectId: body.projectId,
        } as Prisma.InputJsonValue,
      },
    });

    await tx.objectPermission.create({
      data: {
        objectId: object.id,
        userId,
        actions: CREATOR_ACTIONS,
      },
    });

    return tx.floxFolder.update({
      where: { id: created.id },
      data: { objectId: object.id },
      include: { _count: { select: { children: true, objects: true } } },
    });
  });

  await eventBus.publish(PlatformEvents.FolderCreated, {
    workspaceId,
    payload: {
      folderId: folder.id,
      projectId: folder.projectId,
      name: folder.name,
    },
  });

  return serializeFolder(folder);
}

export async function listFolders(query: {
  workspaceId: string;
  projectId: string;
  parentFolderId?: string | null;
  status?: FolderStatus | "all";
  q?: string;
  rootOnly?: boolean;
}) {
  const workspaceId = requireWorkspaceId(query.workspaceId);
  await assertProjectInWorkspace(query.projectId, workspaceId);

  const statusFilter =
    query.status === "all"
      ? undefined
      : query.status
        ? { status: query.status }
        : { status: { not: "Deleted" as const }, deletedAt: null };

  const folders = await prisma.floxFolder.findMany({
    where: {
      workspaceId,
      projectId: query.projectId,
      ...statusFilter,
      ...(query.rootOnly
        ? { parentFolderId: null }
        : query.parentFolderId !== undefined
          ? { parentFolderId: query.parentFolderId }
          : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
              { aiSummary: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ isPinned: "desc" }, { name: "asc" }],
    include: { _count: { select: { children: true, objects: true } } },
  });

  return folders.map(serializeFolder);
}

export async function getFolder(id: string, workspaceId?: string) {
  const folder = await prisma.floxFolder.findUnique({
    where: { id },
    include: {
      _count: { select: { children: true, objects: true } },
      children: {
        where: { status: { not: "Deleted" }, deletedAt: null },
        orderBy: { name: "asc" },
        take: 100,
        include: { _count: { select: { children: true, objects: true } } },
      },
    },
  });
  if (!folder || (workspaceId && folder.workspaceId !== workspaceId)) {
    throw new AuthError("Folder not found", 404);
  }
  return {
    ...serializeFolder(folder),
    children: folder.children.map(serializeFolder),
  };
}

export async function updateFolder(
  id: string,
  userId: number,
  body: UpdateFolderInput,
) {
  const existing = await prisma.floxFolder.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("Folder not found", 404);
  }
  if (existing.isLocked && body.isLocked !== true) {
    // allow unlock and other updates when not keeping lock-only restriction
  }

  const nextName = body.name ?? existing.name;
  const renamed = Boolean(body.name && body.name !== existing.name);
  let slug = existing.slug;
  if (renamed) {
    slug = await uniqueFolderSlug(
      existing.projectId,
      existing.parentFolderId,
      nextName,
    );
  }

  const folder = await prisma.floxFolder.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name, slug } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
      ...(body.icon !== undefined ? { icon: body.icon } : {}),
      ...(body.color !== undefined ? { color: body.color } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.folderType !== undefined ? { folderType: body.folderType } : {}),
      ...(body.aiSummary !== undefined
        ? { aiSummary: body.aiSummary }
        : body.name || body.description || body.folderType
          ? {
              aiSummary: buildFolderAiSummary(
                nextName,
                body.description !== undefined
                  ? body.description
                  : existing.description,
                body.folderType ?? existing.folderType,
              ),
            }
          : {}),
      ...(body.metadata !== undefined
        ? { metadata: body.metadata as Prisma.InputJsonValue }
        : {}),
      ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
      ...(body.isPinned !== undefined ? { isPinned: body.isPinned } : {}),
      ...(body.isLocked !== undefined ? { isLocked: body.isLocked } : {}),
    },
    include: { _count: { select: { children: true, objects: true } } },
  });

  if (folder.objectId) {
    await prisma.floxObject.update({
      where: { id: folder.objectId },
      data: {
        name: folder.name,
        description: folder.description,
        aiSummary: folder.aiSummary,
        updatedBy: userId,
      },
    });
  }

  await eventBus.publish(
    renamed ? PlatformEvents.FolderRenamed : PlatformEvents.FolderUpdated,
    {
      workspaceId: folder.workspaceId,
      payload: { folderId: id, name: folder.name },
    },
  );

  return serializeFolder(folder);
}

async function wouldCreateCycle(
  folderId: string,
  newParentId: string | null,
): Promise<boolean> {
  if (!newParentId) return false;
  if (newParentId === folderId) return true;
  let current: string | null = newParentId;
  const seen = new Set<string>();
  while (current) {
    if (current === folderId) return true;
    if (seen.has(current)) return true;
    seen.add(current);
    const row: { parentFolderId: string | null } | null =
      await prisma.floxFolder.findUnique({
        where: { id: current },
        select: { parentFolderId: true },
      });
    current = row?.parentFolderId ?? null;
  }
  return false;
}

export async function moveFolder(
  id: string,
  parentFolderId: string | null | undefined,
) {
  const folder = await prisma.floxFolder.findUnique({ where: { id } });
  if (!folder || folder.status === "Deleted") {
    throw new AuthError("Folder not found", 404);
  }
  if (folder.isLocked) {
    throw new AuthError("Cannot move a locked folder", 400);
  }

  const nextParent = parentFolderId ?? null;
  if (nextParent) {
    const parent = await prisma.floxFolder.findFirst({
      where: {
        id: nextParent,
        projectId: folder.projectId,
        workspaceId: folder.workspaceId,
        status: { not: "Deleted" },
      },
    });
    if (!parent) {
      throw new AuthError("Target parent must be in the same project", 400);
    }
  }

  if (await wouldCreateCycle(id, nextParent)) {
    throw new AuthError("Cannot move folder into its own descendant", 400);
  }

  const slug = await uniqueFolderSlug(folder.projectId, nextParent, folder.name);
  const updated = await prisma.floxFolder.update({
    where: { id },
    data: { parentFolderId: nextParent, slug },
    include: { _count: { select: { children: true, objects: true } } },
  });

  await eventBus.publish(PlatformEvents.FolderMoved, {
    workspaceId: folder.workspaceId,
    payload: {
      folderId: id,
      parentFolderId: nextParent,
      projectId: folder.projectId,
    },
  });

  return serializeFolder(updated);
}

export async function archiveFolder(id: string) {
  const folder = await prisma.floxFolder.findUnique({ where: { id } });
  if (!folder || folder.status === "Deleted") {
    throw new AuthError("Folder not found", 404);
  }
  const updated = await prisma.floxFolder.update({
    where: { id },
    data: { status: "Archived" },
    include: { _count: { select: { children: true, objects: true } } },
  });
  await eventBus.publish(PlatformEvents.FolderArchived, {
    workspaceId: folder.workspaceId,
    payload: { folderId: id },
  });
  return serializeFolder(updated);
}

export async function restoreFolder(id: string) {
  const folder = await prisma.floxFolder.findUnique({ where: { id } });
  if (!folder) throw new AuthError("Folder not found", 404);
  if (folder.status !== "Archived" && folder.status !== "Deleted") {
    throw new AuthError("Folder is already active", 400);
  }
  const updated = await prisma.floxFolder.update({
    where: { id },
    data: { status: "Active", deletedAt: null },
    include: { _count: { select: { children: true, objects: true } } },
  });
  await eventBus.publish(PlatformEvents.FolderRestored, {
    workspaceId: folder.workspaceId,
    payload: { folderId: id },
  });
  return serializeFolder(updated);
}

export async function deleteFolder(id: string, userId: number) {
  const folder = await prisma.floxFolder.findUnique({ where: { id } });
  if (!folder) throw new AuthError("Folder not found", 404);
  if (folder.isLocked) {
    throw new AuthError("Cannot delete a locked folder", 400);
  }

  const updated = await prisma.floxFolder.update({
    where: { id },
    data: {
      status: "Deleted",
      deletedAt: new Date(),
    },
    include: { _count: { select: { children: true, objects: true } } },
  });

  if (folder.objectId) {
    await prisma.floxObject.update({
      where: { id: folder.objectId },
      data: {
        status: "Deleted",
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  await eventBus.publish(PlatformEvents.FolderDeleted, {
    workspaceId: folder.workspaceId,
    payload: { folderId: id },
  });

  return serializeFolder(updated);
}

export async function duplicateFolder(id: string, userId: number) {
  const source = await prisma.floxFolder.findUnique({
    where: { id },
    include: {
      children: {
        where: { status: { not: "Deleted" }, deletedAt: null },
      },
    },
  });
  if (!source || source.status === "Deleted") {
    throw new AuthError("Folder not found", 404);
  }

  const copy = await createFolder(userId, {
    workspaceId: source.workspaceId,
    projectId: source.projectId,
    parentFolderId: source.parentFolderId,
    name: `${source.name} (copy)`,
    description: source.description,
    icon: source.icon,
    color: source.color,
    folderType: source.folderType,
    metadata: (source.metadata as Record<string, unknown>) ?? {},
  });

  for (const child of source.children) {
    await createFolder(userId, {
      workspaceId: source.workspaceId,
      projectId: source.projectId,
      parentFolderId: copy.id,
      name: child.name,
      description: child.description,
      icon: child.icon,
      color: child.color,
      folderType: child.folderType,
      metadata: (child.metadata as Record<string, unknown>) ?? {},
    });
  }

  await eventBus.publish(PlatformEvents.FolderDuplicated, {
    workspaceId: source.workspaceId,
    payload: { sourceId: id, folderId: copy.id },
  });

  return getFolder(copy.id);
}

export async function createFoldersFromBlueprint(
  userId: number,
  params: {
    workspaceId: string;
    projectId: string;
    folders: BlueprintFolder[];
    parentFolderId?: string | null;
  },
) {
  const created = [];
  for (const node of params.folders) {
    const folder = await createFolder(userId, {
      workspaceId: params.workspaceId,
      projectId: params.projectId,
      parentFolderId: params.parentFolderId ?? null,
      name: node.name,
      folderType: node.folderType,
    });
    created.push(folder);
    if (node.children?.length) {
      await createFoldersFromBlueprint(userId, {
        workspaceId: params.workspaceId,
        projectId: params.projectId,
        parentFolderId: folder.id,
        folders: node.children,
      });
    }
  }
  return created;
}

export function getSmartSuggestions(prompt: string) {
  return suggestFolderTree(prompt);
}
