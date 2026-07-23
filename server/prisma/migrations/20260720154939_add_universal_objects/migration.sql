-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('Workspace', 'Project', 'Folder', 'File', 'Task', 'Meeting', 'Prompt', 'Template', 'Knowledge', 'Person', 'Company', 'Repository', 'Workflow', 'Automation', 'Image', 'Video', 'Spreadsheet', 'Presentation', 'Database', 'Website', 'API');

-- CreateEnum
CREATE TYPE "ObjectStatus" AS ENUM ('Draft', 'Active', 'Archived', 'Deleted', 'Completed', 'InReview', 'Pending', 'Cancelled');

-- CreateEnum
CREATE TYPE "ObjectRelationshipType" AS ENUM ('belongs_to', 'references', 'generated_from', 'contains', 'depends_on', 'blocks', 'related_to', 'assigned_to', 'uses_template', 'attached_to', 'derived_from');

-- CreateEnum
CREATE TYPE "ObjectActivityType" AS ENUM ('Created', 'Updated', 'Archived', 'Deleted', 'Shared', 'Referenced', 'Viewed', 'Downloaded', 'AiGenerated');

-- CreateEnum
CREATE TYPE "ObjectPermissionAction" AS ENUM ('View', 'Comment', 'Edit', 'Delete', 'Share', 'Move', 'Archive');

-- CreateTable
CREATE TABLE "objects" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "objectType" "ObjectType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ObjectStatus" NOT NULL DEFAULT 'Draft',
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "aiSummary" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_relationships" (
    "id" SERIAL NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "sourceObjectId" TEXT NOT NULL,
    "targetObjectId" TEXT NOT NULL,
    "relationshipType" "ObjectRelationshipType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_activities" (
    "id" SERIAL NOT NULL,
    "objectId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER,
    "activityType" "ObjectActivityType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_permissions" (
    "id" SERIAL NOT NULL,
    "objectId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "object_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "objects_workspaceId_idx" ON "objects"("workspaceId");

-- CreateIndex
CREATE INDEX "objects_objectType_idx" ON "objects"("objectType");

-- CreateIndex
CREATE INDEX "objects_status_idx" ON "objects"("status");

-- CreateIndex
CREATE INDEX "objects_createdBy_idx" ON "objects"("createdBy");

-- CreateIndex
CREATE INDEX "object_relationships_workspaceId_idx" ON "object_relationships"("workspaceId");

-- CreateIndex
CREATE INDEX "object_relationships_sourceObjectId_idx" ON "object_relationships"("sourceObjectId");

-- CreateIndex
CREATE INDEX "object_relationships_targetObjectId_idx" ON "object_relationships"("targetObjectId");

-- CreateIndex
CREATE INDEX "object_activities_objectId_idx" ON "object_activities"("objectId");

-- CreateIndex
CREATE INDEX "object_activities_workspaceId_idx" ON "object_activities"("workspaceId");

-- CreateIndex
CREATE INDEX "object_activities_createdAt_idx" ON "object_activities"("createdAt");

-- CreateIndex
CREATE INDEX "object_permissions_userId_idx" ON "object_permissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "object_permissions_objectId_userId_key" ON "object_permissions"("objectId", "userId");

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_relationships" ADD CONSTRAINT "object_relationships_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_relationships" ADD CONSTRAINT "object_relationships_sourceObjectId_fkey" FOREIGN KEY ("sourceObjectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_relationships" ADD CONSTRAINT "object_relationships_targetObjectId_fkey" FOREIGN KEY ("targetObjectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_activities" ADD CONSTRAINT "object_activities_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_activities" ADD CONSTRAINT "object_activities_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_activities" ADD CONSTRAINT "object_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_permissions" ADD CONSTRAINT "object_permissions_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_permissions" ADD CONSTRAINT "object_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
