import { prisma } from "@/infra/db/prisma";
import { AuthError } from "@/lib/workspace-auth";
import { CREATOR_ACTIONS } from "@/lib/object-auth";
import { slugify } from "@/lib/workspace-utils";
import { eventBus, PlatformEvents } from "@/platform";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import {
  getBlueprint,
  inferBlueprintFromPrompt,
  type ProjectBlueprint,
} from "@/domain/project/blueprints";
import * as folderService from "@/domain/folder/folder.service";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/validators/project.schema";
import type {
  Prisma,
  ProjectStatus,
  ProjectType,
} from "@/generated/prisma3";

const DEFAULT_MODULES = {
  overview: true,
  files: true,
  folders: true,
  tasks: true,
  knowledge: true,
  meetings: true,
  activity: true,
  templates: true,
  members: true,
  timeline: true,
  ai: true,
  settings: true,
};

export function buildProjectAiSummary(params: {
  name: string;
  description?: string | null;
  projectType: ProjectType;
  progress: number;
  industry?: string | null;
}) {
  const parts = [
    `This ${params.projectType.toLowerCase()} project “${params.name}”`,
  ];
  if (params.industry) parts.push(`in ${params.industry}`);
  if (params.description?.trim()) {
    parts.push(`— ${params.description.trim().slice(0, 160)}`);
  }
  parts.push(`Current progress is ${params.progress}%.`);
  return parts.join(" ");
}

export function serializeProject<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    startDate: Date | null;
    dueDate: Date | null;
    completedDate: Date | null;
    _count?: { folders?: number };
  },
>(project: T) {
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    deletedAt: project.deletedAt?.toISOString() ?? null,
    startDate: project.startDate?.toISOString() ?? null,
    dueDate: project.dueDate?.toISOString() ?? null,
    completedDate: project.completedDate?.toISOString() ?? null,
    folderCount: project._count?.folders ?? undefined,
  };
}

async function uniqueProjectSlug(workspaceId: string, baseName: string) {
  const base = slugify(baseName) || "project";
  let slug = base;
  let i = 0;
  while (
    await prisma.floxProject.findFirst({
      where: { workspaceId, slug },
    })
  ) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

async function applyBlueprintFolders(
  userId: number,
  workspaceId: string,
  projectId: string,
  blueprint: ProjectBlueprint,
) {
  await folderService.createFoldersFromBlueprint(userId, {
    workspaceId,
    projectId,
    folders: blueprint.folders,
  });
  await eventBus.publish(PlatformEvents.ProjectBlueprintApplied, {
    workspaceId,
    payload: { projectId, blueprintId: blueprint.id },
  });
}

export async function createProject(userId: number, body: CreateProjectInput) {
  const workspaceId = requireWorkspaceId(body.workspaceId);
  const slug = await uniqueProjectSlug(workspaceId, body.name);
  const projectType = body.projectType ?? "Custom";
  const progress = body.progress ?? 0;
  const status = body.status ?? "Draft";
  const priority = body.priority ?? "Medium";
  const visibility = body.visibility ?? "Workspace";
  const aiSummary = buildProjectAiSummary({
    name: body.name,
    description: body.description,
    projectType,
    progress,
    industry: body.industry,
  });

  const blueprint = getBlueprint(body.blueprint);
  const startDate = body.startDate ? new Date(body.startDate) : null;
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;

  const project = await prisma.$transaction(async (tx) => {
    // Task board lives on legacy Express Project, scoped to the same workspace
    const board = await tx.project.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        startDate: startDate ?? undefined,
        endDate: dueDate ?? undefined,
        workspaceId,
      },
    });

    const created = await tx.floxProject.create({
      data: {
        workspaceId,
        name: body.name,
        slug,
        description: body.description ?? null,
        status,
        priority,
        visibility,
        ownerId: userId,
        projectType: blueprint?.projectType ?? projectType,
        industry: body.industry ?? null,
        budget: body.budget ?? null,
        currency: body.currency || "USD",
        startDate,
        dueDate,
        progress,
        color: body.color ?? null,
        icon: body.icon ?? null,
        coverImage: body.coverImage || null,
        aiSummary,
        metadata: (body.metadata ?? {}) as Prisma.InputJsonValue,
        modules: DEFAULT_MODULES as Prisma.InputJsonValue,
        boardProjectId: board.id,
      },
    });

    const object = await tx.floxObject.create({
      data: {
        workspaceId,
        objectType: "Project",
        name: created.name,
        description: created.description,
        status: "Active",
        createdBy: userId,
        updatedBy: userId,
        aiSummary,
        metadata: {
          floxProjectId: created.id,
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

    return tx.floxProject.update({
      where: { id: created.id },
      data: { objectId: object.id },
      include: { _count: { select: { folders: true } } },
    });
  });

  await eventBus.publish(PlatformEvents.ProjectCreated, {
    workspaceId,
    payload: {
      projectId: project.id,
      name: project.name,
      projectType: project.projectType,
    },
  });

  if (blueprint) {
    await applyBlueprintFolders(userId, workspaceId, project.id, blueprint);
  }

  const refreshed = await prisma.floxProject.findUniqueOrThrow({
    where: { id: project.id },
    include: { _count: { select: { folders: true } } },
  });

  return serializeProject(refreshed);
}

export async function listProjects(query: {
  workspaceId: string;
  status?: ProjectStatus | "all";
  projectType?: ProjectType;
  q?: string;
  includeDeleted?: boolean;
}) {
  const workspaceId = requireWorkspaceId(query.workspaceId);

  const projects = await prisma.floxProject.findMany({
    where: {
      workspaceId,
      ...(query.projectType ? { projectType: query.projectType } : {}),
      ...(query.status === "all"
        ? {}
        : query.status
          ? { status: query.status }
          : query.includeDeleted
            ? {}
            : { status: { not: "Deleted" }, deletedAt: null }),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
              { aiSummary: { contains: query.q, mode: "insensitive" } },
              { industry: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { _count: { select: { folders: true } } },
  });

  return projects.map(serializeProject);
}

/** Ensure a Flox project has a workspace-scoped legacy task board. */
export async function ensureBoardForProject(id: string) {
  const existing = await prisma.floxProject.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("Project not found", 404);
  }
  if (existing.boardProjectId) {
    return existing.boardProjectId;
  }

  const board = await prisma.project.create({
    data: {
      name: existing.name,
      description: existing.description,
      startDate: existing.startDate ?? undefined,
      endDate: existing.dueDate ?? undefined,
      workspaceId: existing.workspaceId,
    },
  });

  await prisma.floxProject.update({
    where: { id },
    data: { boardProjectId: board.id },
  });

  return board.id;
}

export async function getProject(id: string, workspaceId?: string) {
  let project = await prisma.floxProject.findUnique({
    where: { id },
    include: {
      _count: { select: { folders: true } },
      owner: {
        select: {
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
    },
  });
  if (!project || (workspaceId && project.workspaceId !== workspaceId)) {
    throw new AuthError("Project not found", 404);
  }

  if (!project.boardProjectId) {
    await ensureBoardForProject(id);
    project = await prisma.floxProject.findUniqueOrThrow({
      where: { id },
      include: {
        _count: { select: { folders: true } },
        owner: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
    });
  }

  return {
    ...serializeProject(project),
    owner: project.owner,
  };
}

export async function updateProject(
  id: string,
  userId: number,
  body: UpdateProjectInput,
) {
  const existing = await prisma.floxProject.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("Project not found", 404);
  }

  let slug = existing.slug;
  if (body.name && body.name !== existing.name) {
    slug = await uniqueProjectSlug(existing.workspaceId, body.name);
  }

  const nextName = body.name ?? existing.name;
  const nextType = body.projectType ?? existing.projectType;
  const nextProgress = body.progress ?? existing.progress;
  const nextDesc =
    body.description !== undefined ? body.description : existing.description;

  const completedDate =
    body.status === "Completed" && !existing.completedDate
      ? new Date()
      : body.completedDate
        ? new Date(body.completedDate)
        : body.status && body.status !== "Completed"
          ? null
          : undefined;

  const project = await prisma.floxProject.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name, slug } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
      ...(body.visibility !== undefined ? { visibility: body.visibility } : {}),
      ...(body.projectType !== undefined
        ? { projectType: body.projectType }
        : {}),
      ...(body.industry !== undefined ? { industry: body.industry } : {}),
      ...(body.budget !== undefined ? { budget: body.budget } : {}),
      ...(body.currency !== undefined ? { currency: body.currency } : {}),
      ...(body.startDate !== undefined
        ? { startDate: body.startDate ? new Date(body.startDate) : null }
        : {}),
      ...(body.dueDate !== undefined
        ? { dueDate: body.dueDate ? new Date(body.dueDate) : null }
        : {}),
      ...(completedDate !== undefined ? { completedDate } : {}),
      ...(body.progress !== undefined ? { progress: body.progress } : {}),
      ...(body.color !== undefined ? { color: body.color } : {}),
      ...(body.icon !== undefined ? { icon: body.icon } : {}),
      ...(body.coverImage !== undefined
        ? { coverImage: body.coverImage || null }
        : {}),
      ...(body.metadata !== undefined
        ? { metadata: body.metadata as Prisma.InputJsonValue }
        : {}),
      ...(body.modules !== undefined
        ? { modules: body.modules as Prisma.InputJsonValue }
        : {}),
      ...(body.aiSummary !== undefined
        ? { aiSummary: body.aiSummary }
        : {
            aiSummary: buildProjectAiSummary({
              name: nextName,
              description: nextDesc,
              projectType: nextType,
              progress: nextProgress,
              industry:
                body.industry !== undefined ? body.industry : existing.industry,
            }),
          }),
    },
    include: { _count: { select: { folders: true } } },
  });

  if (project.objectId) {
    await prisma.floxObject.update({
      where: { id: project.objectId },
      data: {
        name: project.name,
        description: project.description,
        aiSummary: project.aiSummary,
        updatedBy: userId,
      },
    });
  }

  // Keep the linked task board in sync with the Flox project
  if (project.boardProjectId) {
    await prisma.project.update({
      where: { id: project.boardProjectId },
      data: {
        name: project.name,
        description: project.description,
        startDate: project.startDate ?? undefined,
        endDate: project.dueDate ?? undefined,
        workspaceId: project.workspaceId,
      },
    });
  }

  const eventType =
    body.status === "Completed"
      ? PlatformEvents.ProjectCompleted
      : PlatformEvents.ProjectUpdated;

  await eventBus.publish(eventType, {
    workspaceId: project.workspaceId,
    payload: { projectId: id, status: project.status },
  });

  return serializeProject(project);
}

export async function softDeleteProject(id: string, userId: number) {
  const existing = await prisma.floxProject.findUnique({ where: { id } });
  if (!existing) throw new AuthError("Project not found", 404);

  const project = await prisma.floxProject.update({
    where: { id },
    data: {
      status: "Deleted",
      deletedAt: new Date(),
    },
    include: { _count: { select: { folders: true } } },
  });

  if (existing.objectId) {
    await prisma.floxObject.update({
      where: { id: existing.objectId },
      data: {
        status: "Deleted",
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  await eventBus.publish(PlatformEvents.ProjectDeleted, {
    workspaceId: project.workspaceId,
    payload: { projectId: id },
  });

  return serializeProject(project);
}

export async function archiveProject(id: string) {
  const existing = await prisma.floxProject.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("Project not found", 404);
  }
  const project = await prisma.floxProject.update({
    where: { id },
    data: { status: "Archived" },
    include: { _count: { select: { folders: true } } },
  });
  await eventBus.publish(PlatformEvents.ProjectArchived, {
    workspaceId: project.workspaceId,
    payload: { projectId: id },
  });
  return serializeProject(project);
}

export async function restoreProject(id: string) {
  const existing = await prisma.floxProject.findUnique({ where: { id } });
  if (!existing) throw new AuthError("Project not found", 404);
  if (existing.status !== "Archived" && existing.status !== "Deleted") {
    throw new AuthError("Project is already active", 400);
  }
  const project = await prisma.floxProject.update({
    where: { id },
    data: { status: "Active", deletedAt: null },
    include: { _count: { select: { folders: true } } },
  });
  await eventBus.publish(PlatformEvents.ProjectRestored, {
    workspaceId: project.workspaceId,
    payload: { projectId: id },
  });
  return serializeProject(project);
}

export async function duplicateProject(
  id: string,
  userId: number,
  options?: { targetWorkspaceId?: string; name?: string },
) {
  const source = await prisma.floxProject.findUnique({
    where: { id },
    include: {
      folders: {
        where: {
          parentFolderId: null,
          status: { not: "Deleted" },
          deletedAt: null,
        },
      },
    },
  });
  if (!source || source.status === "Deleted") {
    throw new AuthError("Project not found", 404);
  }

  const targetWorkspaceId =
    options?.targetWorkspaceId ?? source.workspaceId;

  const created = await createProject(userId, {
    workspaceId: targetWorkspaceId,
    name: options?.name ?? `${source.name} (copy)`,
    description: source.description,
    status: "Draft",
    priority: source.priority,
    visibility: source.visibility,
    projectType: source.projectType,
    industry: source.industry,
    budget: source.budget,
    currency: source.currency,
    progress: 0,
    color: source.color,
    icon: source.icon,
    coverImage: source.coverImage,
    metadata: (source.metadata as Record<string, unknown>) ?? {},
    blueprint: "none",
  });

  // Copy root folders + one level of children
  for (const root of source.folders) {
    const children = await prisma.floxFolder.findMany({
      where: {
        parentFolderId: root.id,
        status: { not: "Deleted" },
        deletedAt: null,
      },
    });
    const newRoot = await folderService.createFolder(userId, {
      workspaceId: targetWorkspaceId,
      projectId: created.id,
      name: root.name,
      description: root.description,
      icon: root.icon,
      color: root.color,
      folderType: root.folderType,
      metadata: (root.metadata as Record<string, unknown>) ?? {},
    });
    for (const child of children) {
      await folderService.createFolder(userId, {
        workspaceId: targetWorkspaceId,
        projectId: created.id,
        parentFolderId: newRoot.id,
        name: child.name,
        description: child.description,
        icon: child.icon,
        color: child.color,
        folderType: child.folderType,
        metadata: (child.metadata as Record<string, unknown>) ?? {},
      });
    }
  }

  await eventBus.publish(PlatformEvents.ProjectDuplicated, {
    workspaceId: targetWorkspaceId,
    payload: { sourceId: id, projectId: created.id },
  });

  return getProject(created.id);
}

export async function cloneProject(
  id: string,
  userId: number,
  options?: { targetWorkspaceId?: string; name?: string },
) {
  return duplicateProject(id, userId, options);
}

export async function searchProjects(params: {
  workspaceId: string;
  q: string;
  status?: ProjectStatus;
  projectType?: ProjectType;
}) {
  const workspaceId = requireWorkspaceId(params.workspaceId);
  const projects = await prisma.floxProject.findMany({
    where: {
      workspaceId,
      deletedAt: null,
      status: params.status ?? { not: "Deleted" },
      ...(params.projectType ? { projectType: params.projectType } : {}),
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { description: { contains: params.q, mode: "insensitive" } },
        { aiSummary: { contains: params.q, mode: "insensitive" } },
        { industry: { contains: params.q, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { folders: true } } },
  });

  const qLower = params.q.toLowerCase();
  return [...projects]
    .sort((a, b) => {
      const aName = a.name.toLowerCase().includes(qLower) ? 0 : 1;
      const bName = b.name.toLowerCase().includes(qLower) ? 0 : 1;
      return aName - bName;
    })
    .map(serializeProject);
}

export async function createProjectFromPrompt(
  userId: number,
  params: { workspaceId: string; prompt: string; name?: string },
) {
  const blueprint = inferBlueprintFromPrompt(params.prompt);
  const name =
    params.name?.trim() ||
    params.prompt.trim().slice(0, 80) ||
    "New Project";

  return createProject(userId, {
    workspaceId: params.workspaceId,
    name,
    description: params.prompt,
    projectType: blueprint?.projectType ?? "Custom",
    status: "Planning",
    blueprint: blueprint?.id ?? "Software",
  });
}
