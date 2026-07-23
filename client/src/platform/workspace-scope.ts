import { AppError } from "@/platform/errors";

/**
 * Every workspace-scoped query must carry a non-empty workspaceId (ARCH principle).
 */
export function requireWorkspaceId(
  workspaceId: string | null | undefined,
  message = "workspaceId is required",
): string {
  const id = workspaceId?.trim();
  if (!id) {
    throw new AppError("VALIDATION", message, 400);
  }
  return id;
}

export function assertWorkspaceScope(
  resourceWorkspaceId: string,
  requestWorkspaceId: string,
): void {
  if (resourceWorkspaceId !== requestWorkspaceId) {
    throw new AppError(
      "FORBIDDEN",
      "Resource does not belong to the requested workspace",
      403,
    );
  }
}
