import type { CreateFilePayload, FloxFile, FileVersion } from "@/types/file";

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

export const fileApi = {
  list(params: {
    workspaceId: string;
    projectId?: string;
    folderId?: string | null;
    q?: string;
  }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    if (params.projectId) search.set("projectId", params.projectId);
    if (params.folderId) search.set("folderId", params.folderId);
    if (params.q) search.set("q", params.q);
    return fetch(`/api/v1/files?${search}`).then((res) =>
      parseJson<{ files: FloxFile[] }>(res),
    );
  },

  get(id: string) {
    return fetch(`/api/v1/files/${id}`).then((res) =>
      parseJson<{ file: FloxFile }>(res),
    );
  },

  create(payload: CreateFilePayload) {
    return fetch("/api/v1/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ file: FloxFile }>(res));
  },

  update(
    id: string,
    payload: Partial<CreateFilePayload> & {
      contentText?: string | null;
      changeSummary?: string;
    },
  ) {
    return fetch(`/api/v1/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ file: FloxFile }>(res));
  },

  remove(id: string) {
    return fetch(`/api/v1/files/${id}`, { method: "DELETE" }).then((res) =>
      parseJson<{ file: FloxFile }>(res),
    );
  },

  archive(id: string) {
    return fetch(`/api/v1/files/${id}/archive`, { method: "POST" }).then(
      (res) => parseJson<{ file: FloxFile }>(res),
    );
  },

  duplicate(id: string) {
    return fetch(`/api/v1/files/${id}/duplicate`, { method: "POST" }).then(
      (res) => parseJson<{ file: FloxFile }>(res),
    );
  },

  summarize(id: string) {
    return fetch(`/api/v1/files/${id}/summarize`, { method: "POST" }).then(
      (res) => parseJson<{ file: FloxFile }>(res),
    );
  },

  rewrite(id: string, instruction?: string) {
    return fetch(`/api/v1/files/${id}/rewrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
    }).then((res) => parseJson<{ file: FloxFile }>(res));
  },

  versions(id: string) {
    return fetch(`/api/v1/files/${id}/versions`).then((res) =>
      parseJson<{ versions: FileVersion[] }>(res),
    );
  },

  restoreVersion(id: string, version: number) {
    return fetch(`/api/v1/files/${id}/versions/${version}/restore`, {
      method: "POST",
    }).then((res) => parseJson<{ file: FloxFile }>(res));
  },
};
