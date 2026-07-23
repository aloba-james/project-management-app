/**
 * Shim: Brain pipeline now lives behind the AI Brain Gateway.
 * Existing imports keep working during the ARCH-001 transition.
 */
export {
  plan as planBrainRun,
  execute as executeBrainRun,
  listExecutions as listBrainExecutions,
} from "@/ai/brain/gateway";
export { serializeObject } from "@/lib/object-auth";
