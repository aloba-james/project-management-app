import type { BrainAgentKind, BrainIntent } from "@/generated/prisma3";
import type { AgentProfile } from "@/brain/types";

export const AGENT_PROFILES: Record<BrainAgentKind, AgentProfile> = {
  Proposal: {
    kind: "Proposal",
    systemPrompt: "You draft professional proposals and statements of work.",
    preferredTools: ["search_objects", "create_object", "create_relationship"],
  },
  Developer: {
    kind: "Developer",
    systemPrompt: "You help with software design, tasks, and technical docs.",
    preferredTools: ["search_objects", "create_object", "update_object"],
  },
  Finance: {
    kind: "Finance",
    systemPrompt: "You assist with budgets, pricing, and financial summaries.",
    preferredTools: ["search_objects", "create_object", "generate_summary"],
  },
  Research: {
    kind: "Research",
    systemPrompt: "You research topics and synthesize findings.",
    preferredTools: ["search_objects", "model_complete", "create_object"],
  },
  Meeting: {
    kind: "Meeting",
    systemPrompt: "You organize meetings and produce agendas/notes.",
    preferredTools: ["create_object", "generate_summary"],
  },
  Design: {
    kind: "Design",
    systemPrompt: "You help with design briefs and creative direction.",
    preferredTools: ["create_object", "generate_summary"],
  },
  Legal: {
    kind: "Legal",
    systemPrompt: "You draft careful legal-oriented outlines (not legal advice).",
    preferredTools: ["search_objects", "create_object", "generate_summary"],
  },
  Marketing: {
    kind: "Marketing",
    systemPrompt: "You produce marketing copy and campaign outlines.",
    preferredTools: ["create_object", "generate_summary"],
  },
  General: {
    kind: "General",
    systemPrompt: "You are a general workspace assistant.",
    preferredTools: [
      "search_objects",
      "model_complete",
      "create_object",
      "generate_summary",
    ],
  },
};

export function selectAgent(
  intent: BrainIntent,
  prompt: string,
  preferred?: BrainAgentKind,
): BrainAgentKind {
  if (preferred) return preferred;

  const p = prompt.toLowerCase();
  if (/proposal|sow|rfp/.test(p)) return "Proposal";
  if (/code|bug|api|refactor|developer/.test(p)) return "Developer";
  if (/budget|invoice|pricing|finance/.test(p)) return "Finance";
  if (/research|investigate/.test(p) || intent === "Research") return "Research";
  if (/meeting|agenda|standup|schedule/.test(p) || intent === "Schedule")
    return "Meeting";
  if (/design|ui|brand|visual/.test(p)) return "Design";
  if (/legal|contract|compliance/.test(p)) return "Legal";
  if (/market|campaign|seo|copy/.test(p)) return "Marketing";
  return "General";
}

export function getAgentProfile(kind: BrainAgentKind): AgentProfile {
  return AGENT_PROFILES[kind];
}
