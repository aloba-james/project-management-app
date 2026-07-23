import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
  WorkspaceDetail,
  WorkspaceSuggestion,
} from "@/types/workspace";

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

export const workspaceService = {
  list(params?: { status?: string; q?: string }) {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.q) search.set("q", params.q);
    const qs = search.toString();
    return fetch(`/api/v1/workspaces${qs ? `?${qs}` : ""}`).then((res) =>
      parseJson<{ workspaces: Workspace[] }>(res),
    );
  },

  get(id: string) {
    return fetch(`/api/v1/workspaces/${id}`).then((res) =>
      parseJson<{ workspace: WorkspaceDetail }>(res),
    );
  },

  create(payload: CreateWorkspacePayload) {
    return fetch("/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ workspace: Workspace }>(res));
  },

  update(id: string, payload: UpdateWorkspacePayload) {
    return fetch(`/api/v1/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ workspace: Workspace }>(res));
  },

  remove(id: string) {
    return fetch(`/api/v1/workspaces/${id}`, { method: "DELETE" }).then((res) =>
      parseJson<{ workspace: Workspace }>(res),
    );
  },

  archive(id: string) {
    return fetch(`/api/v1/workspaces/${id}/archive`, { method: "POST" }).then(
      (res) => parseJson<{ workspace: Workspace }>(res),
    );
  },

  restore(id: string) {
    return fetch(`/api/v1/workspaces/${id}/restore`, { method: "POST" }).then(
      (res) => parseJson<{ workspace: Workspace }>(res),
    );
  },

  aiSuggestions(payload: {
    name: string;
    description?: string | null;
    prompt?: string | null;
  }) {
    return fetch("/api/v1/workspaces/ai-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ suggestions: WorkspaceSuggestion[] }>(res));
  },

  ensurePersonal() {
    return fetch("/api/v1/workspaces/ensure-personal", {
      method: "POST",
    }).then((res) =>
      parseJson<{ created: boolean; workspace: Workspace }>(res),
    );
  },
};
