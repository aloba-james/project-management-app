import { z } from "zod";

export const brainAgentSchema = z.enum([
  "Proposal",
  "Developer",
  "Finance",
  "Research",
  "Meeting",
  "Design",
  "Legal",
  "Marketing",
  "General",
]);

export const brainModelProviderSchema = z.enum([
  "LocalStub",
  "OpenAI",
  "Anthropic",
  "GoogleGemini",
  "Grok",
  "Mistral",
  "DeepSeek",
  "Ollama",
]);

export const brainPromptSchema = z.object({
  workspaceId: z.string().uuid(),
  prompt: z.string().trim().min(1).max(8000),
  rootObjectId: z.string().uuid().optional().nullable(),
  executionPlanId: z.string().uuid().optional().nullable(),
  confirm: z.boolean().optional().default(false),
  preferredAgent: brainAgentSchema.optional(),
  preferredModel: brainModelProviderSchema.optional(),
});

export const brainContextSchema = z.object({
  workspaceId: z.string().uuid(),
  rootObjectId: z.string().uuid().optional().nullable(),
  prompt: z.string().trim().max(8000).optional(),
});

export const brainSearchSchema = z.object({
  workspaceId: z.string().uuid(),
  q: z.string().trim().min(1).max(200),
});

export type BrainPromptInput = z.infer<typeof brainPromptSchema>;
