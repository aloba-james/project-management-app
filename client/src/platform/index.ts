export { AppError, isAppError } from "./errors";
export {
  requireWorkspaceId,
  assertWorkspaceScope,
} from "./workspace-scope";
export { eventBus, PrismaEventBus } from "./events/bus";
export type { EventBus, EventHandler } from "./events/bus";
export { PlatformEvents } from "./events/types";
export type { PlatformEvent, PlatformEventName } from "./events/types";
export { getInfrastructureHealth } from "./architecture-health";
export type { HealthItem } from "./architecture-health";
