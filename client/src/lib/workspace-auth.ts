import { auth, currentUser } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isClerkConfigured } from "@/lib/clerk";
import type { User, WorkspaceMemberRole } from "@/generated/prisma3";

export type AppAuthUser = User;

async function upsertFromClerk(): Promise<AppAuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    null;
  const username =
    clerkUser?.username ||
    clerkUser?.firstName ||
    email?.split("@")[0] ||
    `user_${userId.slice(0, 8)}`;
  const cognitoId = `clerk:${userId}`;

  return prisma.user.upsert({
    where: { cognitoId },
    create: {
      cognitoId,
      username: await uniqueUsername(username),
      email: email ?? undefined,
      profilePictureUrl: clerkUser?.imageUrl,
    },
    update: {
      email: email ?? undefined,
      profilePictureUrl: clerkUser?.imageUrl ?? undefined,
    },
  });
}

async function upsertFromNextAuth(): Promise<AppAuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.oauthId) return null;

  const cognitoId = session.user.oauthId;
  const username =
    session.user.username ||
    session.user.name?.replace(/\s+/g, "") ||
    session.user.email?.split("@")[0] ||
    `user_${cognitoId.slice(-8)}`;

  return prisma.user.upsert({
    where: { cognitoId },
    create: {
      cognitoId,
      username: await uniqueUsername(username),
      email: session.user.email ?? undefined,
      profilePictureUrl: session.user.image ?? undefined,
    },
    update: {
      email: session.user.email ?? undefined,
      profilePictureUrl: session.user.image ?? undefined,
    },
  });
}

async function uniqueUsername(base: string): Promise<string> {
  const sanitized = base.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "user";
  let candidate = sanitized;
  let i = 0;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    i += 1;
    candidate = `${sanitized}${i}`;
  }
  return candidate;
}

export async function requireAppUser(): Promise<AppAuthUser> {
  const user = isClerkConfigured()
    ? await upsertFromClerk()
    : await upsertFromNextAuth();

  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

const WRITE_ROLES: WorkspaceMemberRole[] = ["Owner", "Admin"];
const ADMIN_ROLES: WorkspaceMemberRole[] = ["Owner", "Admin"];

export async function requireWorkspaceMember(
  workspaceId: string,
  userId: number,
  roles?: WorkspaceMemberRole[],
) {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
    include: { workspace: true },
  });

  if (!membership) {
    throw new AuthError("Forbidden", 403);
  }

  if (roles && !roles.includes(membership.role)) {
    throw new AuthError("Forbidden", 403);
  }

  return membership;
}

export async function requireWorkspaceWrite(
  workspaceId: string,
  userId: number,
) {
  const membership = await requireWorkspaceMember(
    workspaceId,
    userId,
    WRITE_ROLES,
  );

  if (membership.workspace.status === "Archived") {
    throw new AuthError("Archived workspaces are read-only", 403);
  }
  if (membership.workspace.status === "Deleted") {
    throw new AuthError("Workspace is deleted", 403);
  }

  return membership;
}

export async function requireWorkspaceAdmin(
  workspaceId: string,
  userId: number,
) {
  return requireWorkspaceMember(workspaceId, userId, ADMIN_ROLES);
}

export { WRITE_ROLES, ADMIN_ROLES };
