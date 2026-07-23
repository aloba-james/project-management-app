export type BrainIntent =
  | "Create"
  | "Update"
  | "Delete"
  | "Search"
  | "Summarize"
  | "Generate"
  | "Translate"
  | "Explain"
  | "Research"
  | "Analyze"
  | "Automate"
  | "Schedule"
  | "Build"
  | "Deploy"
  | "Import"
  | "Export"
  | "Review"
  | "Approve"
  | "Compare";

export type BrainAgentKind =
  | "Proposal"
  | "Developer"
  | "Finance"
  | "Research"
  | "Meeting"
  | "Design"
  | "Legal"
  | "Marketing"
  | "General";

export type BrainModelProvider =
  | "LocalStub"
  | "OpenAI"
  | "Anthropic"
  | "GoogleGemini"
  | "Grok"
  | "Mistral"
  | "DeepSeek"
  | "Ollama";

export type BrainPlanStep = {
  id: string;
  tool: string;
  description: string;
  requiresConfirmation?: boolean;
};

export type BrainPlan = {
  intent: BrainIntent;
  agent: BrainAgentKind;
  modelProvider: BrainModelProvider;
  modelId: string;
  plan: BrainPlanStep[];
  contextObjectIds: string[];
  requiresConfirmation: boolean;
};

export type BrainExecutionResult = BrainPlan & {
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

export type BrainExecutionSummary = {
  id: string;
  prompt: string;
  intent: BrainIntent;
  agent: BrainAgentKind;
  modelProvider: BrainModelProvider;
  modelId: string;
  status: string;
  resultObjectIds: string[];
  durationMs: number;
  error: string | null;
  createdAt: string;
  user: { userId: number; username: string };
};

export type BrainPromptPayload = {
  workspaceId: string;
  prompt: string;
  rootObjectId?: string | null;
  confirm?: boolean;
  preferredAgent?: BrainAgentKind;
  preferredModel?: BrainModelProvider;
};
