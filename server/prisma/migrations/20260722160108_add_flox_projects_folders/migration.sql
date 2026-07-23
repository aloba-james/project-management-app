-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Draft', 'Planning', 'Active', 'OnHold', 'Blocked', 'Completed', 'Cancelled', 'Archived', 'Deleted');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('Software', 'Marketing', 'Research', 'Healthcare', 'Sales', 'Finance', 'HR', 'Construction', 'Legal', 'Education', 'Operations', 'Startup', 'Personal', 'Custom');

-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('Private', 'Workspace', 'PublicLink', 'Restricted');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "FolderStatus" AS ENUM ('Active', 'Archived', 'Locked', 'Hidden', 'Deleted');

-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('General', 'Development', 'Design', 'Marketing', 'Finance', 'Legal', 'HR', 'Research', 'Sales', 'Operations', 'Knowledge', 'Archive', 'Assets', 'Templates', 'Custom');

-- AlterTable
ALTER TABLE "objects" ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "flox_projects" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'Draft',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'Medium',
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'Workspace',
    "ownerId" INTEGER NOT NULL,
    "projectType" "ProjectType" NOT NULL DEFAULT 'Custom',
    "industry" TEXT,
    "budget" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "icon" TEXT,
    "coverImage" TEXT,
    "aiSummary" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "modules" JSONB NOT NULL DEFAULT '{"overview":true,"files":true,"folders":true,"tasks":true,"knowledge":true,"meetings":true,"activity":true,"templates":true,"members":true,"timeline":true,"ai":true,"settings":true}',
    "objectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "flox_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flox_folders" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentFolderId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "status" "FolderStatus" NOT NULL DEFAULT 'Active',
    "folderType" "FolderType" NOT NULL DEFAULT 'General',
    "ownerId" INTEGER NOT NULL,
    "aiSummary" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "objectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "flox_folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flox_projects_objectId_key" ON "flox_projects"("objectId");

-- CreateIndex
CREATE INDEX "flox_projects_workspaceId_idx" ON "flox_projects"("workspaceId");

-- CreateIndex
CREATE INDEX "flox_projects_ownerId_idx" ON "flox_projects"("ownerId");

-- CreateIndex
CREATE INDEX "flox_projects_status_idx" ON "flox_projects"("status");

-- CreateIndex
CREATE INDEX "flox_projects_projectType_idx" ON "flox_projects"("projectType");

-- CreateIndex
CREATE UNIQUE INDEX "flox_projects_workspaceId_slug_key" ON "flox_projects"("workspaceId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "flox_folders_objectId_key" ON "flox_folders"("objectId");

-- CreateIndex
CREATE INDEX "flox_folders_workspaceId_idx" ON "flox_folders"("workspaceId");

-- CreateIndex
CREATE INDEX "flox_folders_projectId_idx" ON "flox_folders"("projectId");

-- CreateIndex
CREATE INDEX "flox_folders_parentFolderId_idx" ON "flox_folders"("parentFolderId");

-- CreateIndex
CREATE INDEX "flox_folders_status_idx" ON "flox_folders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "flox_folders_projectId_parentFolderId_slug_key" ON "flox_folders"("projectId", "parentFolderId", "slug");

-- CreateIndex
CREATE INDEX "objects_folderId_idx" ON "objects"("folderId");

-- AddForeignKey
ALTER TABLE "flox_projects" ADD CONSTRAINT "flox_projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_projects" ADD CONSTRAINT "flox_projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_folders" ADD CONSTRAINT "flox_folders_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_folders" ADD CONSTRAINT "flox_folders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "flox_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_folders" ADD CONSTRAINT "flox_folders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_folders" ADD CONSTRAINT "flox_folders_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "flox_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "flox_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
