import type {
  BrainExecutionResult,
  BrainExecutionSummary,
  BrainPlan,
  BrainPromptPayload,
} from "@/types/brain";
import type { FloxObject } from "@/types/object";

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { error?: string }).error ||
      (data as { issues?: { message: string }[] }).issues?.[0]?.message ||
      `Request failed (${res.status})`;
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

export const brainService = {
  plan(payload: BrainPromptPayload) {
    return fetch("/api/v1/brain/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ plan: BrainPlan }>(res));
  },

  execute(payload: BrainPromptPayload) {
    return fetch("/api/v1/brain/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ execution: BrainExecutionResult }>(res));
  },

  context(payload: {
    workspaceId: string;
    rootObjectId?: string | null;
    prompt?: string;
  }) {
    return fetch("/api/v1/brain/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) =>
      parseJson<{
        context: {
          workspaceId: string;
          objectIds: string[];
          memory: Record<string, unknown>;
          objects: FloxObject[];
        };
      }>(res),
    );
  },

  search(payload: { workspaceId: string; q: string }) {
    return fetch("/api/v1/brain/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) =>
      parseJson<{ objects: FloxObject[]; q: string }>(res),
    );
  },

  executions(workspaceId: string) {
    return fetch(
      `/api/v1/brain/executions?workspaceId=${encodeURIComponent(workspaceId)}`,
    ).then((res) =>
      parseJson<{ executions: BrainExecutionSummary[] }>(res),
    );
  },
};
