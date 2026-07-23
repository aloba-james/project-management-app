import type { BrainAgentKind, BrainIntent } from "@/generated/prisma3";
import { selectAgent } from "@/brain/routing/agents";
import { recommendModel } from "@/planner/estimate";
import type { PlannerStepDraft } from "@/planner/types";

function step(
  order: number,
  title: string,
  description: string,
  tool: string,
  agent: BrainAgentKind,
  model: string,
  extra?: Partial<PlannerStepDraft>,
): PlannerStepDraft {
  return {
    order,
    title,
    description,
    tool,
    agent,
    model,
    estimatedTime: extra?.estimatedTime ?? 5,
    estimatedCost: extra?.estimatedCost ?? 0,
    dependsOn: extra?.dependsOn ?? (order > 1 ? [`s${order - 1}`] : []),
    approvalRequired: extra?.approvalRequired ?? false,
    outputObjectHints: extra?.outputObjectHints ?? [],
  };
}

/**
 * Builds ordered planner steps. Does not execute — planning only.
 */
export function buildPlannerSteps(params: {
  intent: BrainIntent;
  prompt: string;
  agent: BrainAgentKind;
  modelId: string;
}): PlannerStepDraft[] {
  const { intent, prompt, agent, modelId } = params;
  const p = prompt.toLowerCase();

  // Large "build a startup / ecommerce" style plans
  if (/ecommerce|startup|entire platform|full stack app/.test(p)) {
    return massiveBuildPlan(agent, modelId, prompt);
  }

  if (/proposal/.test(p) || (intent === "Generate" && /hospital|client|rfp|sow/.test(p))) {
    return proposalPlan(agent, modelId, prompt);
  }

  switch (intent) {
    case "Delete":
      return [
        step(1, "Locate target", "Find objects matching the delete request", "search_objects", agent, modelId),
        step(2, "Soft-delete object", "Delete with confirmation", "delete_object", agent, modelId, {
          approvalRequired: true,
          dependsOn: ["s1"],
        }),
      ];
    case "Search":
      return [
        step(1, "Search objects", `Search for: ${prompt.slice(0, 80)}`, "search_objects", agent, modelId, {
          dependsOn: [],
        }),
        step(2, "Summarize findings", "Summarize search results", "generate_summary", agent, modelId, {
          dependsOn: ["s1"],
        }),
      ];
    case "Summarize":
      return [
        step(1, "Gather context", "Load related workspace objects", "search_objects", agent, modelId, {
          dependsOn: [],
        }),
        step(2, "Load memory", "Load preferences", "load_memory", agent, modelId, { dependsOn: ["s1"] }),
        step(3, "Generate summary", "Produce summary", "generate_summary", agent, modelId, {
          dependsOn: ["s1", "s2"],
        }),
      ];
    case "Update":
      return [
        step(1, "Gather context", "Find object to update", "search_objects", agent, modelId, {
          dependsOn: [],
        }),
        step(2, "Draft changes", "Generate update content", "model_complete", agent, modelId, {
          dependsOn: ["s1"],
        }),
        step(3, "Apply update", "Update object", "update_object", agent, modelId, {
          dependsOn: ["s2"],
        }),
        step(4, "Summarize", "Summarize changes", "generate_summary", agent, modelId, {
          dependsOn: ["s3"],
        }),
      ];
    case "Schedule":
      return [
        step(1, "Gather context", "Load calendar-related objects", "search_objects", agent, modelId, {
          dependsOn: [],
        }),
        step(2, "Draft meeting", "Generate meeting details", "model_complete", agent, modelId),
        step(3, "Create meeting object", "Persist Meeting", "create_object", agent, modelId, {
          outputObjectHints: ["Meeting"],
          dependsOn: ["s2"],
        }),
        step(4, "Summarize", "Summarize scheduled item", "generate_summary", agent, modelId, {
          dependsOn: ["s3"],
        }),
      ];
    case "Deploy":
      return [
        step(1, "Verify repository", "Ensure repository object exists", "search_objects", agent, modelId, {
          dependsOn: [],
          outputObjectHints: ["Repository"],
        }),
        step(2, "Prepare deploy notes", "Generate deployment guidance", "model_complete", agent, modelId),
        step(3, "Save deploy guide", "Store as Knowledge", "create_object", agent, modelId, {
          dependsOn: ["s1", "s2"],
          approvalRequired: true,
        }),
      ];
    default:
      return [
        step(1, "Gather context", "Retrieve relevant objects", "search_objects", agent, modelId, {
          dependsOn: [],
        }),
        step(2, "Load memory", "Load preferences", "load_memory", agent, modelId, { dependsOn: ["s1"] }),
        step(3, "Find templates", "Retrieve templates if available", "search_objects", agent, modelId, {
          dependsOn: ["s1"],
          outputObjectHints: ["Template"],
        }),
        step(4, "Generate content", "Produce draft via recommended model", "model_complete", agent, modelId, {
          dependsOn: ["s2", "s3"],
        }),
        step(5, "Save output", "Persist as workspace object", "create_object", agent, modelId, {
          dependsOn: ["s4"],
        }),
        step(6, "Link objects", "Relate to project/root when present", "create_relationship", agent, modelId, {
          dependsOn: ["s5"],
        }),
        step(7, "Generate summary", "Write AI summary", "generate_summary", agent, modelId, {
          dependsOn: ["s5"],
        }),
      ];
  }
}

function proposalPlan(
  agent: BrainAgentKind,
  modelId: string,
  prompt: string,
): PlannerStepDraft[] {
  return [
    step(1, "Find proposal template", "Locate company proposal template", "search_objects", agent, modelId, {
      dependsOn: [],
      outputObjectHints: ["Template"],
    }),
    step(2, "Find company profile", "Retrieve company/profile objects", "search_objects", "Legal", modelId, {
      dependsOn: [],
      outputObjectHints: ["Company"],
    }),
    step(3, "Find pricing", "Retrieve pricing knowledge", "search_objects", "Finance", modelId, {
      dependsOn: [],
    }),
    step(4, "Generate proposal", "Draft the proposal document", "model_complete", agent, modelId, {
      dependsOn: ["s1", "s2", "s3"],
    }),
    step(5, "Generate timeline", "Create implementation timeline", "model_complete", agent, modelId, {
      dependsOn: ["s4"],
    }),
    step(6, "Save documents", "Persist proposal as File/Knowledge", "create_object", agent, modelId, {
      dependsOn: ["s4", "s5"],
      outputObjectHints: ["File"],
    }),
    step(7, "Link project", "Attach to current project if present", "create_relationship", agent, modelId, {
      dependsOn: ["s6"],
    }),
    step(8, "Generate summary", "Summarize the proposal", "generate_summary", agent, modelId, {
      dependsOn: ["s6"],
    }),
  ];
}

function massiveBuildPlan(
  agent: BrainAgentKind,
  modelId: string,
  _prompt: string,
): PlannerStepDraft[] {
  const titles = [
    ["Create projects structure", "create_object", "Project"],
    ["Generate business plan", "model_complete", "Knowledge"],
    ["Generate financial model", "model_complete", "Spreadsheet"],
    ["Generate pitch deck outline", "model_complete", "Presentation"],
    ["Generate website outline", "model_complete", "Website"],
    ["Generate database design", "model_complete", "Database"],
    ["Generate backend outline", "model_complete", "Knowledge"],
    ["Generate frontend outline", "model_complete", "Knowledge"],
    ["Generate roadmap", "model_complete", "Knowledge"],
    ["Assign starter tasks", "create_object", "Task"],
  ] as const;

  return titles.map(([title, tool, hint], i) =>
    step(
      i + 1,
      title,
      title,
      tool,
      i === 2 ? "Finance" : i >= 5 && i <= 7 ? "Developer" : agent,
      modelId,
      {
        dependsOn: i === 0 ? [] : [`s${i}`],
        outputObjectHints: [hint],
        estimatedTime: 20,
      },
    ),
  );
}

export function resolvePlannerAgent(
  intent: BrainIntent,
  prompt: string,
  preferred?: BrainAgentKind,
) {
  return selectAgent(intent, prompt, preferred);
}

export { recommendModel };
