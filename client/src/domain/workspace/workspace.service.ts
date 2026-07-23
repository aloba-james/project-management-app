import { prisma } from "@/infra/db/prisma";
import { AuthError } from "@/lib/workspace-auth";
import {
  serializeWorkspace,
  uniqueSlug,
  writeAuditLog,
} from "@/lib/workspace-utils";
import { eventBus, PlatformEvents } from "@/platform";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "@/validators/workspace.schema";
import type { WorkspaceStatus } from "@/generated/prisma3";

export type WorkspaceListQuery = {
  status?: "Active" | "Archived" | "Deleted" | "all";
  q?: string;
};

export async function listWorkspaces(userId: number, query: WorkspaceListQuery) {
  const statusFilter: WorkspaceStatus[] =
    query.status === "all"
      ? ["Active", "Archived", "Deleted"]
      : [(query.status ?? "Active") as WorkspaceStatus];

  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: {
        status: { in: statusFilter },
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q, mode: "insensitive" } },
                { description: { contains: query.q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    },
    include: {
      workspace: {
        include: {
          _count: { select: { members: true, projects: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((m) => ({
    ...serializeWorkspace(m.workspace),
    role: m.role,
    memberCount: m.workspace._count.members,
    projectCount: m.workspace._count.projects,
  }));
}

export async function createWorkspace(
  userId: number,
  body: CreateWorkspaceInput,
) {
  const existing = await prisma.workspace.findFirst({
    where: {
      ownerId: userId,
      name: body.name,
      status: { not: "Deleted" },
    },
  });
  if (existing) {
    throw new AuthError("You already have a workspace with this name", 409);
  }

  const slug = await uniqueSlug(body.name);
  const workspace = await prisma.workspace.create({
    data: {
      name: body.name,
      slug,
      description: body.description || null,
      workspaceType: body.workspaceType,
      industry: body.industry || null,
      website: body.website || null,
      country: body.country || null,
      timezone: body.timezone || null,
      language: body.language || null,
      icon: body.icon || null,
      logoUrl: body.logoUrl || null,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "Owner",
        },
      },
    },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId: workspace.id,
    userId,
    action: "workspace.created",
    metadata: { name: workspace.name },
  });

  await eventBus.publish(PlatformEvents.WorkspaceCreated, {
    workspaceId: workspace.id,
    payload: { name: workspace.name, workspaceType: workspace.workspaceType },
  });

  return {
    ...serializeWorkspace(workspace),
    role: "Owner" as const,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  };
}

export async function getWorkspace(id: string, role: string) {
  const workspaceId = requireWorkspaceId(id);
  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspaceId },
    include: {
      _count: { select: { members: true, projects: true } },
      members: {
        include: {
          user: {
            select: {
              userId: true,
              username: true,
              email: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { userId: true, username: true } },
        },
      },
    },
  });

  return {
    ...serializeWorkspace(workspace),
    role,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
    members: workspace.members,
    recentActivity: workspace.auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      createdAt: log.createdAt.toISOString(),
      user: log.user,
      metadata: log.metadata,
    })),
  };
}

export async function updateWorkspace(
  id: string,
  userId: number,
  body: UpdateWorkspaceInput,
  role: string,
) {
  const workspaceId = requireWorkspaceId(id);

  if (body.name) {
    const duplicate = await prisma.workspace.findFirst({
      where: {
        ownerId: userId,
        name: body.name,
        id: { not: workspaceId },
        status: { not: "Deleted" },
      },
    });
    if (duplicate) {
      throw new AuthError("You already have a workspace with this name", 409);
    }
  }

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined
        ? { description: body.description || null }
        : {}),
      ...(body.workspaceType !== undefined
        ? { workspaceType: body.workspaceType }
        : {}),
      ...(body.industry !== undefined ? { industry: body.industry || null } : {}),
      ...(body.website !== undefined ? { website: body.website || null } : {}),
      ...(body.country !== undefined ? { country: body.country || null } : {}),
      ...(body.timezone !== undefined ? { timezone: body.timezone || null } : {}),
      ...(body.language !== undefined ? { language: body.language || null } : {}),
      ...(body.icon !== undefined ? { icon: body.icon || null } : {}),
      ...(body.logoUrl !== undefined ? { logoUrl: body.logoUrl || null } : {}),
    },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId,
    userId,
    action: "workspace.updated",
    metadata: body,
  });

  await eventBus.publish(PlatformEvents.WorkspaceUpdated, {
    workspaceId,
    payload: body,
  });

  return {
    ...serializeWorkspace(workspace),
    role,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  };
}

export async function softDeleteWorkspace(
  id: string,
  userId: number,
  role: string,
) {
  const workspaceId = requireWorkspaceId(id);
  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      status: "Deleted",
      deletedAt: new Date(),
    },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId,
    userId,
    action: "workspace.deleted",
  });

  await eventBus.publish(PlatformEvents.WorkspaceDeleted, {
    workspaceId,
    payload: {},
  });

  return {
    ...serializeWorkspace(workspace),
    role,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  };
}

export async function archiveWorkspace(
  id: string,
  userId: number,
  role: string,
  currentStatus: string,
) {
  const workspaceId = requireWorkspaceId(id);
  if (currentStatus === "Deleted") {
    throw new AuthError("Cannot archive a deleted workspace", 400);
  }

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: { status: "Archived" },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId,
    userId,
    action: "workspace.archived",
  });

  await eventBus.publish(PlatformEvents.WorkspaceArchived, {
    workspaceId,
    payload: {},
  });

  return {
    ...serializeWorkspace(workspace),
    role,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  };
}

export async function restoreWorkspace(
  id: string,
  userId: number,
  role: string,
  currentStatus: string,
) {
  const workspaceId = requireWorkspaceId(id);
  if (currentStatus !== "Archived" && currentStatus !== "Deleted") {
    throw new AuthError("Workspace is already active", 400);
  }

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      status: "Active",
      deletedAt: null,
    },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId,
    userId,
    action: "workspace.restored",
    metadata: { from: currentStatus },
  });

  await eventBus.publish(PlatformEvents.WorkspaceRestored, {
    workspaceId,
    payload: { from: currentStatus },
  });

  return {
    ...serializeWorkspace(workspace),
    role,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  };
}

export async function ensurePersonalWorkspace(userId: number, username: string) {
  const existing = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: { status: { in: ["Active", "Archived"] } },
    },
    include: {
      workspace: {
        include: {
          _count: { select: { members: true, projects: true } },
        },
      },
    },
  });

  if (existing) {
    return {
      created: false as const,
      workspace: {
        ...serializeWorkspace(existing.workspace),
        role: existing.role,
        memberCount: existing.workspace._count.members,
        projectCount: existing.workspace._count.projects,
      },
    };
  }

  const name = "Personal";
  const slug = await uniqueSlug(`${username}-personal`);

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      description: "Your personal workspace",
      workspaceType: "Personal",
      ownerId: userId,
      members: {
        create: { userId, role: "Owner" },
      },
    },
    include: {
      _count: { select: { members: true, projects: true } },
    },
  });

  await writeAuditLog({
    workspaceId: workspace.id,
    userId,
    action: "workspace.created",
    metadata: { name, bootstrap: true },
  });

  await eventBus.publish(PlatformEvents.WorkspaceCreated, {
    workspaceId: workspace.id,
    payload: { name, bootstrap: true },
  });

  return {
    created: true as const,
    workspace: {
      ...serializeWorkspace(workspace),
      role: "Owner" as const,
      memberCount: workspace._count.members,
      projectCount: workspace._count.projects,
    },
  };
}
