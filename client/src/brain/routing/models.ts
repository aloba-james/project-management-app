import type { BrainModelProvider } from "@/generated/prisma3";
import type { ModelAdapter } from "@/brain/types";
import { localStubAdapter } from "@/brain/models/local-stub";
import { notConfiguredAdapter } from "@/brain/models/not-configured";

const ADAPTERS: ModelAdapter[] = [
  localStubAdapter,
  notConfiguredAdapter("OpenAI", "gpt-4o-mini"),
  notConfiguredAdapter("Anthropic", "claude-sonnet"),
  notConfiguredAdapter("GoogleGemini", "gemini-pro"),
  notConfiguredAdapter("Grok", "grok-2"),
  notConfiguredAdapter("Mistral", "mistral-large"),
  notConfiguredAdapter("DeepSeek", "deepseek-chat"),
  notConfiguredAdapter("Ollama", "llama3"),
];

export function getModelAdapter(
  preferred?: BrainModelProvider,
): ModelAdapter {
  if (preferred) {
    const found = ADAPTERS.find((a) => a.provider === preferred);
    if (found?.isConfigured()) return found;
    if (found && preferred === "LocalStub") return found;
    // Fall back to stub if preferred provider not configured
  }
  const configured = ADAPTERS.find((a) => a.isConfigured());
  return configured ?? localStubAdapter;
}

export function listModelAdapters(): ModelAdapter[] {
  return ADAPTERS;
}
