import type { BrainIntent } from "@/generated/prisma3";

const RULES: Array<{ intent: BrainIntent; patterns: RegExp[] }> = [
  { intent: "Delete", patterns: [/\b(delete|remove|destroy|trash)\b/i] },
  { intent: "Search", patterns: [/\b(search|find|locate|look up)\b/i] },
  { intent: "Summarize", patterns: [/\b(summarize|summary|tldr|recap)\b/i] },
  { intent: "Translate", patterns: [/\b(translate|translation)\b/i] },
  { intent: "Explain", patterns: [/\b(explain|clarify|what is|how does)\b/i] },
  { intent: "Research", patterns: [/\b(research|investigate|explore)\b/i] },
  { intent: "Analyze", patterns: [/\b(analyze|analysis|compare metrics)\b/i] },
  { intent: "Compare", patterns: [/\b(compare|vs\.?|versus|diff)\b/i] },
  { intent: "Schedule", patterns: [/\b(schedule|calendar|book|meeting time)\b/i] },
  { intent: "Automate", patterns: [/\b(automate|workflow|trigger)\b/i] },
  { intent: "Build", patterns: [/\b(build|implement|code|develop)\b/i] },
  { intent: "Deploy", patterns: [/\b(deploy|release|ship)\b/i] },
  { intent: "Import", patterns: [/\b(import|ingest|upload data)\b/i] },
  { intent: "Export", patterns: [/\b(export|download|csv|pdf)\b/i] },
  { intent: "Review", patterns: [/\b(review|audit|check)\b/i] },
  { intent: "Approve", patterns: [/\b(approve|sign off|accept)\b/i] },
  { intent: "Generate", patterns: [/\b(generate|draft|write|compose)\b/i] },
  { intent: "Update", patterns: [/\b(update|edit|modify|rename|change)\b/i] },
  { intent: "Create", patterns: [/\b(create|add|new|make)\b/i] },
];

export function classifyIntent(prompt: string): BrainIntent {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(prompt))) {
      return rule.intent;
    }
  }
  return "Generate";
}
