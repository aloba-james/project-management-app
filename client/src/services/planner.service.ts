import type {
  CreatePlannerPayload,
  ExecutionPlan,
} from "@/types/planner";

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

export const plannerService = {
  create(payload: CreatePlannerPayload) {
    return fetch("/api/v1/planner/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ plan: ExecutionPlan }>(res));
  },

  list(workspaceId: string) {
    return fetch(
      `/api/v1/planner?workspaceId=${encodeURIComponent(workspaceId)}`,
    ).then((res) => parseJson<{ plans: ExecutionPlan[] }>(res));
  },

  get(id: string) {
    return fetch(`/api/v1/planner/${id}`).then((res) =>
      parseJson<{ plan: ExecutionPlan }>(res),
    );
  },

  approve(id: string) {
    return fetch(`/api/v1/planner/${id}/approve`, { method: "POST" }).then(
      (res) => parseJson<{ plan: ExecutionPlan }>(res),
    );
  },

  cancel(id: string) {
    return fetch(`/api/v1/planner/${id}/cancel`, { method: "POST" }).then(
      (res) => parseJson<{ plan: ExecutionPlan }>(res),
    );
  },

  resume(id: string, confirm?: boolean) {
    return fetch(`/api/v1/planner/${id}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: Boolean(confirm) }),
    }).then((res) =>
      parseJson<{ plan: ExecutionPlan; execution?: unknown }>(res),
    );
  },
};
