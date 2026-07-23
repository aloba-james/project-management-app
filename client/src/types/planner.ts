export type PlanComplexity =
  | "Simple"
  | "Medium"
  | "Complex"
  | "Enterprise"
  | "Massive";

export type PlanStrategy =
  | "SingleStep"
  | "MultiStep"
  | "Parallel"
  | "Sequential"
  | "Conditional"
  | "Hybrid";

export type ExecutionPlanStatus =
  | "Draft"
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "Running"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Paused";

export type ExecutionStepStatus =
  | "Pending"
  | "Ready"
  | "Running"
  | "Completed"
  | "Failed"
  | "Skipped"
  | "Cancelled";

export type ExecutionPlanStep = {
  id: string;
  planId: string;
  order: number;
  title: string;
  description: string | null;
  agent: string;
  tool: string;
  model: string | null;
  status: ExecutionStepStatus;
  estimatedTime: number;
  estimatedCost: number;
  retryCount: number;
  maxRetries: number;
  dependsOn: string[];
  outputObjects: string[];
  approvalRequired: boolean;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExecutionPlan = {
  id: string;
  workspaceId: string;
  userId: number;
  prompt: string;
  goal: string;
  summary: string | null;
  intent: string;
  complexity: PlanComplexity;
  strategy: PlanStrategy;
  estimatedDuration: number;
  estimatedTokens: number;
  estimatedCost: number;
  status: ExecutionPlanStatus;
  approvalRequired: boolean;
  dependencies: unknown;
  warnings: unknown;
  requiredAgents: string[];
  requiredModels: string[];
  requiredTools: string[];
  requiredObjects: string[];
  selectedObjectIds: string[];
  rootObjectId: string | null;
  brainExecutionId: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  steps?: ExecutionPlanStep[];
};

export type CreatePlannerPayload = {
  workspaceId: string;
  prompt: string;
  rootObjectId?: string | null;
  selectedObjectIds?: string[];
};
