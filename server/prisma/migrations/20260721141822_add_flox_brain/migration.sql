-- CreateEnum
CREATE TYPE "BrainIntent" AS ENUM ('Create', 'Update', 'Delete', 'Search', 'Summarize', 'Generate', 'Translate', 'Explain', 'Research', 'Analyze', 'Automate', 'Schedule', 'Build', 'Deploy', 'Import', 'Export', 'Review', 'Approve', 'Compare');

-- CreateEnum
CREATE TYPE "BrainExecutionStatus" AS ENUM ('Planned', 'Running', 'Completed', 'Failed', 'Cancelled', 'AwaitingConfirmation');

-- CreateEnum
CREATE TYPE "BrainAgentKind" AS ENUM ('Proposal', 'Developer', 'Finance', 'Research', 'Meeting', 'Design', 'Legal', 'Marketing', 'General');

-- CreateEnum
CREATE TYPE "BrainModelProvider" AS ENUM ('LocalStub', 'OpenAI', 'Anthropic', 'GoogleGemini', 'Grok', 'Mistral', 'DeepSeek', 'Ollama');

-- CreateEnum
CREATE TYPE "BrainMemoryScope" AS ENUM ('user', 'workspace');

-- CreateTable
CREATE TABLE "brain_executions" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "intent" "BrainIntent" NOT NULL,
    "plan" JSONB NOT NULL DEFAULT '[]',
    "contextSnapshot" JSONB NOT NULL DEFAULT '{}',
    "agent" "BrainAgentKind" NOT NULL DEFAULT 'General',
    "modelProvider" "BrainModelProvider" NOT NULL DEFAULT 'LocalStub',
    "modelId" TEXT NOT NULL DEFAULT 'local-stub-v1',
    "toolsUsed" JSONB NOT NULL DEFAULT '[]',
    "result" JSONB,
    "resultObjectIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tokenUsage" INTEGER,
    "costCents" INTEGER,
    "error" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "status" "BrainExecutionStatus" NOT NULL DEFAULT 'Planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brain_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brain_memories" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "scope" "BrainMemoryScope" NOT NULL,
    "ownerKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brain_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brain_events" (
    "id" SERIAL NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "executionId" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brain_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brain_executions_workspaceId_idx" ON "brain_executions"("workspaceId");

-- CreateIndex
CREATE INDEX "brain_executions_userId_idx" ON "brain_executions"("userId");

-- CreateIndex
CREATE INDEX "brain_executions_status_idx" ON "brain_executions"("status");

-- CreateIndex
CREATE INDEX "brain_executions_createdAt_idx" ON "brain_executions"("createdAt");

-- CreateIndex
CREATE INDEX "brain_memories_workspaceId_idx" ON "brain_memories"("workspaceId");

-- CreateIndex
CREATE INDEX "brain_memories_userId_idx" ON "brain_memories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "brain_memories_workspaceId_ownerKey_key_key" ON "brain_memories"("workspaceId", "ownerKey", "key");

-- CreateIndex
CREATE INDEX "brain_events_workspaceId_idx" ON "brain_events"("workspaceId");

-- CreateIndex
CREATE INDEX "brain_events_executionId_idx" ON "brain_events"("executionId");

-- CreateIndex
CREATE INDEX "brain_events_createdAt_idx" ON "brain_events"("createdAt");

-- AddForeignKey
ALTER TABLE "brain_executions" ADD CONSTRAINT "brain_executions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brain_executions" ADD CONSTRAINT "brain_executions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brain_memories" ADD CONSTRAINT "brain_memories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brain_memories" ADD CONSTRAINT "brain_memories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brain_events" ADD CONSTRAINT "brain_events_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brain_events" ADD CONSTRAINT "brain_events_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "brain_executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
