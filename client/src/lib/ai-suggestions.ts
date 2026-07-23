import type { AiSuggestionsInput } from "@/validators/workspace.schema";

export type WorkspaceSuggestion = {
  id: string;
  kind: "project" | "folder" | "setting";
  title: string;
  description: string;
};

/**
 * Rule-based stub — does not create projects/folders.
 * Returns recommendations for the user to review and approve.
 */
export function buildAiSuggestions(
  input: AiSuggestionsInput,
): WorkspaceSuggestion[] {
  const text = `${input.name} ${input.description ?? ""} ${input.prompt ?? ""}`.toLowerCase();
  const suggestions: WorkspaceSuggestion[] = [];

  const push = (
    kind: WorkspaceSuggestion["kind"],
    title: string,
    description: string,
  ) => {
    suggestions.push({
      id: `${kind}-${suggestions.length + 1}`,
      kind,
      title,
      description,
    });
  };

  if (/market|brand|campaign|seo/.test(text)) {
    push("project", "Campaign Pipeline", "Track campaigns from brief to launch.");
    push("folder", "Brand Assets", "Central place for logos, copy, and creatives.");
    push("setting", "Marketing timezone", "Align deadlines to campaign launch windows.");
  } else if (/health|clinic|patient|care/.test(text)) {
    push("project", "Care Coordination", "Coordinate care tasks across the team.");
    push("folder", "Protocols", "Store clinical checklists and SOPs.");
  } else if (/soft|app|dev|engineer|code|saas/.test(text)) {
    push("project", "Product Roadmap", "Prioritize features and ship milestones.");
    push("project", "Bug Triage", "Capture and prioritize defects.");
    push("folder", "Specs", "PRDs, RFCs, and technical notes.");
  } else if (/financ|budget|invoice|account/.test(text)) {
    push("project", "Close Calendar", "Month-end close checklist.");
    push("folder", "Reports", "Financial reports and reconciliations.");
  } else if (/legal|contract|compliance/.test(text)) {
    push("project", "Matter Tracker", "Track matters and deadlines.");
    push("folder", "Contracts", "Active agreements and templates.");
  } else if (/educat|course|student|learn/.test(text)) {
    push("project", "Curriculum Plan", "Plan modules and delivery dates.");
    push("folder", "Materials", "Lesson plans and resources.");
  } else {
    push("project", "Getting Started", `First project for ${input.name}.`);
    push("folder", "Documents", "Shared docs and references.");
    push("setting", "Team workspace defaults", "Invite collaborators and set permissions.");
  }

  if (input.prompt?.trim()) {
    push(
      "project",
      "From your prompt",
      `Suggested based on: “${input.prompt.trim().slice(0, 120)}”`,
    );
  }

  return suggestions.slice(0, 6);
}
