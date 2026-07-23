import type {
  BrainAgentKind,
  BrainIntent,
  BrainModelProvider,
  FloxObject,
} from "@/generated/prisma3";

export type PlanStep = {
  id: string;
  tool: string;
  description: string;
  requiresConfirmation?: boolean;
  args?: Record<string, unknown>;
};

export type BrainContextBundle = {
  workspaceId: string;
  rootObjectId?: string | null;
  objects: FloxObject[];
  memory: Record<string, unknown>;
  objectIds: string[];
};

export type ModelCompleteInput = {
  prompt: string;
  intent: BrainIntent;
  agent: BrainAgentKind;
  contextSummary: string;
};

export type ModelCompleteResult = {
  text: string;
  tokenUsage?: number;
  costCents?: number;
};

export type ModelAdapter = {
  provider: BrainModelProvider;
  modelId: string;
  isConfigured: () => boolean;
  complete: (input: ModelCompleteInput) => Promise<ModelCompleteResult>;
};

export type AgentProfile = {
  kind: BrainAgentKind;
  systemPrompt: string;
  preferredTools: string[];
};

export type ToolContext = {
  workspaceId: string;
  userId: number;
  confirm: boolean;
  rootObjectId?: string | null;
  prompt: string;
  intent: BrainIntent;
  generatedText?: string;
};

export type ToolResult = {
  ok: boolean;
  tool: string;
  message: string;
  objectIds?: string[];
  data?: unknown;
  requiresConfirmation?: boolean;
};

export type BrainRunInput = {
  workspaceId: string;
  userId: number;
  prompt: string;
  rootObjectId?: string | null;
  confirm?: boolean;
  preferredAgent?: BrainAgentKind;
  preferredModel?: BrainModelProvider;
};

export type BrainPlanResult = {
  intent: BrainIntent;
  agent: BrainAgentKind;
  modelProvider: BrainModelProvider;
  modelId: string;
  plan: PlanStep[];
  contextObjectIds: string[];
  requiresConfirmation: boolean;
};

export type BrainExecuteResult = BrainPlanResult & {
  executionId: string;
  status: string;
  result: {
    text: string;
    objectIds: string[];
    toolsUsed: string[];
  };
  durationMs: number;
  error?: string | null;
};
