import type {
  CreateProjectPayload,
  FloxProject,
  UpdateProjectPayload,
} from "@/types/project";

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

export const floxProjectApi = {
  list(params: {
    workspaceId: string;
    status?: string;
    projectType?: string;
    q?: string;
  }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    if (params.status) search.set("status", params.status);
    if (params.projectType) search.set("projectType", params.projectType);
    if (params.q) search.set("q", params.q);
    return fetch(`/api/v1/projects?${search}`).then((res) =>
      parseJson<{ projects: FloxProject[] }>(res),
    );
  },

  get(id: string) {
    return fetch(`/api/v1/projects/${id}`).then((res) =>
      parseJson<{ project: FloxProject }>(res),
    );
  },

  create(payload: CreateProjectPayload) {
    return fetch("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ project: FloxProject }>(res));
  },

  update(id: string, payload: UpdateProjectPayload) {
    return fetch(`/api/v1/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ project: FloxProject }>(res));
  },

  remove(id: string) {
    return fetch(`/api/v1/projects/${id}`, { method: "DELETE" }).then((res) =>
      parseJson<{ project: FloxProject }>(res),
    );
  },

  archive(id: string) {
    return fetch(`/api/v1/projects/${id}/archive`, { method: "POST" }).then(
      (res) => parseJson<{ project: FloxProject }>(res),
    );
  },

  restore(id: string) {
    return fetch(`/api/v1/projects/${id}/restore`, { method: "POST" }).then(
      (res) => parseJson<{ project: FloxProject }>(res),
    );
  },

  duplicate(id: string, body?: { name?: string; targetWorkspaceId?: string }) {
    return fetch(`/api/v1/projects/${id}/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    }).then((res) => parseJson<{ project: FloxProject }>(res));
  },

  fromPrompt(payload: {
    workspaceId: string;
    prompt: string;
    name?: string;
  }) {
    return fetch("/api/v1/projects/from-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ project: FloxProject }>(res));
  },
};
