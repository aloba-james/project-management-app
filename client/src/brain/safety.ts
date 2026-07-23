import { AuthError } from "@/lib/workspace-auth";

export function assertSameWorkspace(
  objectWorkspaceId: string,
  expectedWorkspaceId: string,
) {
  if (objectWorkspaceId !== expectedWorkspaceId) {
    throw new AuthError(
      "AI must never cross workspace boundaries without explicit approval",
      403,
    );
  }
}

export function isDangerousTool(tool: string): boolean {
  return tool === "delete_object";
}
