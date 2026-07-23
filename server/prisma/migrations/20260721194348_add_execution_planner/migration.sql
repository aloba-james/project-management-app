-- CreateEnum
CREATE TYPE "PlanComplexity" AS ENUM ('Simple', 'Medium', 'Complex', 'Enterprise', 'Massive');

-- CreateEnum
CREATE TYPE "PlanStrategy" AS ENUM ('SingleStep', 'MultiStep', 'Parallel', 'Sequential', 'Conditional', 'Hybrid');

-- CreateEnum
CREATE TYPE "ExecutionPlanStatus" AS ENUM ('Draft', 'PendingApproval', 'Approved', 'Rejected', 'Running', 'Completed', 'Failed', 'Cancelled', 'Paused');

-- CreateEnum
CREATE TYPE "ExecutionStepStatus" AS ENUM ('Pending', 'Ready', 'Running', 'Completed', 'Failed', 'Skipped', 'Cancelled');

-- CreateTable
CREATE TABLE "execution_plans" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "summary" TEXT,
    "intent" "BrainIntent" NOT NULL,
    "complexity" "PlanComplexity" NOT NULL DEFAULT 'Simple',
    "strategy" "PlanStrategy" NOT NULL DEFAULT 'Sequential',
    "estimatedDuration" INTEGER NOT NULL DEFAULT 0,
    "estimatedTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" INTEGER NOT NULL DEFAULT 0,
    "status" "ExecutionPlanStatus" NOT NULL DEFAULT 'Draft',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "warnings" JSONB NOT NULL DEFAULT '[]',
    "requiredAgents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredModels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredTools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredObjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "selectedObjectIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rootObjectId" TEXT,
    "brainExecutionId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "execution_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_plan_steps" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "agent" "BrainAgentKind" NOT NULL DEFAULT 'General',
    "tool" TEXT NOT NULL,
    "model" TEXT,
    "status" "ExecutionStepStatus" NOT NULL DEFAULT 'Pending',
    "estimatedTime" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "dependsOn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "outputObjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "execution_plan_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "execution_plans_workspaceId_idx" ON "execution_plans"("workspaceId");

-- CreateIndex
CREATE INDEX "execution_plans_userId_idx" ON "execution_plans"("userId");

-- CreateIndex
CREATE INDEX "execution_plans_status_idx" ON "execution_plans"("status");

-- CreateIndex
CREATE INDEX "execution_plans_createdAt_idx" ON "execution_plans"("createdAt");

-- CreateIndex
CREATE INDEX "execution_plan_steps_planId_idx" ON "execution_plan_steps"("planId");

-- CreateIndex
CREATE INDEX "execution_plan_steps_order_idx" ON "execution_plan_steps"("order");

-- AddForeignKey
ALTER TABLE "execution_plans" ADD CONSTRAINT "execution_plans_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_plans" ADD CONSTRAINT "execution_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_plan_steps" ADD CONSTRAINT "execution_plan_steps_planId_fkey" FOREIGN KEY ("planId") REFERENCES "execution_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
