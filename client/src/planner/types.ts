import type {
  BrainAgentKind,
  BrainIntent,
  BrainModelProvider,
  PlanComplexity,
  PlanStrategy,
} from "@/generated/prisma3";

export type PlannerStepDraft = {
  order: number;
  title: string;
  description: string;
  agent: BrainAgentKind;
  tool: string;
  model: string;
  estimatedTime: number;
  estimatedCost: number;
  dependsOn: string[];
  approvalRequired: boolean;
  outputObjectHints: string[];
};

export type PlannerDraft = {
  goal: string;
  summary: string;
  intent: BrainIntent;
  complexity: PlanComplexity;
  strategy: PlanStrategy;
  estimatedDuration: number;
  estimatedTokens: number;
  estimatedCost: number;
  approvalRequired: boolean;
  dependencies: string[];
  warnings: string[];
  requiredAgents: string[];
  requiredModels: string[];
  requiredTools: string[];
  requiredObjects: string[];
  steps: PlannerStepDraft[];
  recommendedModelProvider: BrainModelProvider;
  recommendedModelId: string;
  recommendedAgent: BrainAgentKind;
};

export type CreatePlanInput = {
  workspaceId: string;
  userId: number;
  prompt: string;
  rootObjectId?: string | null;
  selectedObjectIds?: string[];
  preferredAgent?: BrainAgentKind;
  preferredModel?: BrainModelProvider;
};
