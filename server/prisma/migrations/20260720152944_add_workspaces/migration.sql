-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('Personal', 'Business', 'Startup', 'Software', 'Healthcare', 'Education', 'Marketing', 'Research', 'Finance', 'Legal', 'Custom');

-- CreateEnum
CREATE TYPE "WorkspacePlan" AS ENUM ('Free', 'Pro', 'Enterprise');

-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('Active', 'Archived', 'Deleted');

-- CreateEnum
CREATE TYPE "WorkspaceMemberRole" AS ENUM ('Owner', 'Admin', 'Manager', 'Editor', 'Viewer', 'Guest');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "workspaceId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "icon" TEXT,
    "workspaceType" "WorkspaceType" NOT NULL DEFAULT 'Personal',
    "industry" TEXT,
    "website" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "plan" "WorkspacePlan" NOT NULL DEFAULT 'Free',
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'Active',
    "storageLimit" INTEGER NOT NULL DEFAULT 1073741824,
    "storageUsed" INTEGER NOT NULL DEFAULT 0,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" SERIAL NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "WorkspaceMemberRole" NOT NULL DEFAULT 'Viewer',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceAuditLog" (
    "id" SERIAL NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "ip" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");

-- CreateIndex
CREATE INDEX "Workspace_status_idx" ON "Workspace"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_ownerId_name_key" ON "Workspace"("ownerId", "name");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "WorkspaceAuditLog_workspaceId_idx" ON "WorkspaceAuditLog"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceAuditLog_createdAt_idx" ON "WorkspaceAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceAuditLog" ADD CONSTRAINT "WorkspaceAuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceAuditLog" ADD CONSTRAINT "WorkspaceAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
