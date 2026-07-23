import type { BrainIntent } from "@/generated/prisma3";
import type { PlannerStepDraft } from "@/planner/types";

export function collectDependencies(
  intent: BrainIntent,
  prompt: string,
  steps: PlannerStepDraft[],
): string[] {
  const deps: string[] = [];
  const p = prompt.toLowerCase();

  if (/deploy/.test(p) || intent === "Deploy") {
    deps.push("Repository object should exist before deploy guidance");
  }
  if (/invoice|billing/.test(p)) {
    deps.push("Customer/Company object should exist before invoices");
  }
  if (/architecture|deployment guide/.test(p)) {
    deps.push("System architecture knowledge should exist first");
  }
  for (const s of steps) {
    if (s.dependsOn.length) {
      deps.push(`Step ${s.order} depends on ${s.dependsOn.join(", ")}`);
    }
  }
  return [...new Set(deps)];
}

export function collectWarnings(
  intent: BrainIntent,
  steps: PlannerStepDraft[],
  approvalRequired: boolean,
): string[] {
  const warnings: string[] = [];
  if (approvalRequired) {
    warnings.push("This plan requires explicit approval before execution");
  }
  if (intent === "Delete") {
    warnings.push("Destructive action: soft-delete only; confirm carefully");
  }
  if (steps.some((s) => s.tool === "model_complete")) {
    warnings.push("Model recommendation only — planner does not call LLMs");
  }
  if (steps.length >= 8) {
    warnings.push("Long-running multi-step plan; consider approving in stages");
  }
  return warnings;
}

export function requiresApproval(
  intent: BrainIntent,
  prompt: string,
  steps: PlannerStepDraft[],
): boolean {
  if (intent === "Delete") return true;
  if (/delete workspace|send email|charge|payment|deploy to prod/.test(prompt.toLowerCase())) {
    return true;
  }
  return steps.some((s) => s.approvalRequired);
}
