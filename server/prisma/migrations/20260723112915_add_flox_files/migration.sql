-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('Draft', 'Active', 'Archived', 'Locked', 'Deleted');

-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('Markdown', 'Word', 'Excel', 'PowerPoint', 'PDF', 'Image', 'Video', 'Audio', 'CSV', 'JSON', 'YAML', 'XML', 'TXT', 'HTML', 'React', 'Python', 'Java', 'Go', 'Rust', 'SQL', 'Canvas', 'Whiteboard', 'DatabaseSchema', 'Other');

-- CreateEnum
CREATE TYPE "FileVersionSource" AS ENUM ('Manual', 'AI', 'Import', 'Upload');

-- CreateTable
CREATE TABLE "flox_files" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "folderId" TEXT,
    "objectId" TEXT,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT NOT NULL DEFAULT 'text/plain',
    "fileKind" "FileKind" NOT NULL DEFAULT 'TXT',
    "description" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'Draft',
    "ownerId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "checksum" TEXT,
    "language" TEXT,
    "encoding" TEXT DEFAULT 'utf-8',
    "version" INTEGER NOT NULL DEFAULT 1,
    "storageLocation" TEXT,
    "thumbnail" TEXT,
    "coverImage" TEXT,
    "contentText" TEXT,
    "aiSummary" TEXT,
    "aiKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "intent" TEXT,
    "purpose" TEXT,
    "entities" JSONB NOT NULL DEFAULT '[]',
    "confidenceScore" DOUBLE PRECISION,
    "generationSource" TEXT,
    "promptId" TEXT,
    "executionPlanId" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "flox_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flox_file_versions" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "contentText" TEXT,
    "storageLocation" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "checksum" TEXT,
    "changeSummary" TEXT,
    "editorId" INTEGER,
    "source" "FileVersionSource" NOT NULL DEFAULT 'Manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flox_file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flox_files_objectId_key" ON "flox_files"("objectId");

-- CreateIndex
CREATE INDEX "flox_files_workspaceId_idx" ON "flox_files"("workspaceId");

-- CreateIndex
CREATE INDEX "flox_files_projectId_idx" ON "flox_files"("projectId");

-- CreateIndex
CREATE INDEX "flox_files_folderId_idx" ON "flox_files"("folderId");

-- CreateIndex
CREATE INDEX "flox_files_status_idx" ON "flox_files"("status");

-- CreateIndex
CREATE INDEX "flox_files_fileKind_idx" ON "flox_files"("fileKind");

-- CreateIndex
CREATE INDEX "flox_files_ownerId_idx" ON "flox_files"("ownerId");

-- CreateIndex
CREATE INDEX "flox_file_versions_fileId_idx" ON "flox_file_versions"("fileId");

-- CreateIndex
CREATE INDEX "flox_file_versions_createdAt_idx" ON "flox_file_versions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "flox_file_versions_fileId_version_key" ON "flox_file_versions"("fileId", "version");

-- AddForeignKey
ALTER TABLE "flox_files" ADD CONSTRAINT "flox_files_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_files" ADD CONSTRAINT "flox_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "flox_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_files" ADD CONSTRAINT "flox_files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "flox_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_files" ADD CONSTRAINT "flox_files_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_file_versions" ADD CONSTRAINT "flox_file_versions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "flox_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flox_file_versions" ADD CONSTRAINT "flox_file_versions_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
