import type { ModelAdapter, ModelCompleteInput, ModelCompleteResult } from "@/brain/types";

export const localStubAdapter: ModelAdapter = {
  provider: "LocalStub",
  modelId: "local-stub-v1",
  isConfigured: () => true,
  async complete(input: ModelCompleteInput): Promise<ModelCompleteResult> {
    const lines = [
      `[${input.agent} / LocalStub]`,
      `Intent: ${input.intent}`,
      "",
      `Response to: “${input.prompt.trim()}”`,
      "",
      input.contextSummary
        ? `Context considered:\n${input.contextSummary}`
        : "No prior objects in context.",
      "",
      "Draft output:",
      generateDraft(input),
    ];
    const text = lines.join("\n");
    return {
      text,
      tokenUsage: Math.ceil(text.length / 4),
      costCents: 0,
    };
  },
};

function generateDraft(input: ModelCompleteInput): string {
  const title = deriveTitle(input.prompt);
  switch (input.intent) {
    case "Create":
    case "Generate":
    case "Build":
      return `# ${title}\n\n## Overview\n${input.prompt.trim()}\n\n## Next steps\n1. Review this draft\n2. Attach related workspace objects\n3. Share with stakeholders`;
    case "Summarize":
      return `Summary: ${input.prompt.trim().slice(0, 280)}`;
    case "Schedule":
      return `Meeting: ${title}\nAgenda:\n- Goals\n- Discussion\n- Actions`;
    case "Research":
    case "Analyze":
      return `Findings for “${title}”\n- Key points from workspace context\n- Risks\n- Recommendations`;
    default:
      return title;
  }
}

export function deriveTitle(prompt: string): string {
  const cleaned = prompt.replace(/^["'\s]+|["'\s]+$/g, "").trim();
  const match = cleaned.match(
    /(?:create|generate|draft|write|make|build)\s+(?:a|an|the)?\s*(.+)$/i,
  );
  const raw = (match?.[1] || cleaned).slice(0, 80);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
