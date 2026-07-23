import type { BrainIntent, PlanComplexity, PlanStrategy } from "@/generated/prisma3";

export function estimateComplexity(
  intent: BrainIntent,
  prompt: string,
  stepCount: number,
): PlanComplexity {
  const p = prompt.toLowerCase();
  if (/ecommerce|startup|platform|enterprise|entire system/.test(p) || stepCount >= 10) {
    return "Massive";
  }
  if (/architecture|migrate|multi.?agent|deploy.+prod/.test(p) || stepCount >= 8) {
    return "Enterprise";
  }
  if (intent === "Build" || intent === "Deploy" || stepCount >= 6) {
    return "Complex";
  }
  if (stepCount >= 4 || intent === "Research" || intent === "Analyze") {
    return "Medium";
  }
  return "Simple";
}

export function estimateStrategy(
  intent: BrainIntent,
  stepCount: number,
): PlanStrategy {
  if (stepCount <= 1) return "SingleStep";
  if (intent === "Compare" || intent === "Research") return "Hybrid";
  if (stepCount >= 6) return "Sequential";
  return "MultiStep";
}

/** Rough token/cost estimates for planning UI (not billing). */
export function estimateCost(params: {
  complexity: PlanComplexity;
  stepCount: number;
  promptLength: number;
}) {
  const baseTokens: Record<PlanComplexity, number> = {
    Simple: 800,
    Medium: 2000,
    Complex: 5000,
    Enterprise: 12000,
    Massive: 30000,
  };
  const estimatedTokens =
    baseTokens[params.complexity] +
    params.stepCount * 350 +
    Math.ceil(params.promptLength / 4);
  // LocalStub = $0; estimate as if cloud for visibility
  const estimatedCost = Math.max(0, Math.round(estimatedTokens / 1000) * 2);
  const durationPerStep: Record<PlanComplexity, number> = {
    Simple: 3,
    Medium: 8,
    Complex: 15,
    Enterprise: 30,
    Massive: 60,
  };
  const estimatedDuration = params.stepCount * durationPerStep[params.complexity];
  return { estimatedTokens, estimatedCost, estimatedDuration };
}

export function recommendModel(intent: BrainIntent, prompt: string) {
  const p = prompt.toLowerCase();
  if (/image|logo|banner|visual/.test(p)) {
    return { provider: "LocalStub" as const, modelId: "local-stub-v1", reason: "Image tools not configured; stub used" };
  }
  if (/code|api|refactor|bug|backend|frontend/.test(p) || intent === "Build") {
    return { provider: "LocalStub" as const, modelId: "local-stub-v1", reason: "Coding tasks → GPT/DeepSeek when configured; using LocalStub" };
  }
  if (/research|analyze|compare/.test(p) || intent === "Research") {
    return { provider: "LocalStub" as const, modelId: "local-stub-v1", reason: "Research → Gemini when configured; using LocalStub" };
  }
  if (/proposal|write|draft|creative|story/.test(p)) {
    return { provider: "LocalStub" as const, modelId: "local-stub-v1", reason: "Creative writing → Claude when configured; using LocalStub" };
  }
  return { provider: "LocalStub" as const, modelId: "local-stub-v1", reason: "Default LocalStub adapter" };
}
