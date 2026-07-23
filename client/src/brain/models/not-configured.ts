import type { BrainModelProvider } from "@/generated/prisma3";
import type { ModelAdapter } from "@/brain/types";

export function notConfiguredAdapter(
  provider: BrainModelProvider,
  modelId: string,
): ModelAdapter {
  return {
    provider,
    modelId,
    isConfigured: () => false,
    async complete() {
      throw new Error(
        `${provider} adapter is not configured. Set provider credentials or use LocalStub.`,
      );
    },
  };
}
