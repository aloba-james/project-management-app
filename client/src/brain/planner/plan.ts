import type { BrainIntent } from "@/generated/prisma3";
import type { PlanStep } from "@/brain/types";

function step(
  id: string,
  tool: string,
  description: string,
  extra?: Partial<PlanStep>,
): PlanStep {
  return { id, tool, description, ...extra };
}

export function buildExecutionPlan(
  intent: BrainIntent,
  prompt: string,
): PlanStep[] {
  const base: PlanStep[] = [
    step("1", "search_objects", "Retrieve relevant workspace objects"),
    step("2", "load_memory", "Load workspace and user memory preferences"),
  ];

  switch (intent) {
    case "Search":
      return [
        step("1", "search_objects", `Search objects for: ${prompt.slice(0, 80)}`),
        step("2", "generate_summary", "Summarize search findings"),
      ];
    case "Summarize":
      return [
        ...base,
        step("3", "generate_summary", "Generate summary from context"),
      ];
    case "Delete":
      return [
        step("1", "search_objects", "Locate objects to delete"),
        step("2", "delete_object", "Soft-delete matching object", {
          requiresConfirmation: true,
        }),
      ];
    case "Update":
      return [
        ...base,
        step("3", "model_complete", "Draft update content"),
        step("4", "update_object", "Apply update to target object"),
        step("5", "generate_summary", "Summarize changes"),
      ];
    case "Create":
    case "Generate":
    case "Build":
      return [
        ...base,
        step("3", "search_objects", "Retrieve templates if any"),
        step("4", "model_complete", "Generate content via selected model"),
        step("5", "create_object", "Save result as a workspace object"),
        step("6", "create_relationship", "Link to root/project when present"),
        step("7", "generate_summary", "Generate AI summary for the object"),
      ];
    case "Schedule":
      return [
        ...base,
        step("3", "model_complete", "Draft meeting details"),
        step("4", "create_object", "Create Meeting object"),
        step("5", "generate_summary", "Summarize scheduled item"),
      ];
    case "Research":
    case "Analyze":
    case "Compare":
    case "Explain":
    case "Review":
      return [
        ...base,
        step("3", "model_complete", "Produce analysis"),
        step("4", "create_object", "Store analysis as Knowledge object"),
        step("5", "generate_summary", "Summarize findings"),
      ];
    default:
      return [
        ...base,
        step("3", "model_complete", "Generate response"),
        step("4", "create_object", "Persist output as Prompt/Knowledge object"),
        step("5", "generate_summary", "Generate summary"),
      ];
  }
}
