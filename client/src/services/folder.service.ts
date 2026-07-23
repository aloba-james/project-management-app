import type {
  CreateFolderPayload,
  FloxFolder,
  FolderSuggestion,
} from "@/types/folder";

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

export const folderApi = {
  list(params: {
    workspaceId: string;
    projectId: string;
    parentFolderId?: string | null;
    rootOnly?: boolean;
    q?: string;
  }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    search.set("projectId", params.projectId);
    if (params.rootOnly) search.set("rootOnly", "true");
    if (params.parentFolderId !== undefined && params.parentFolderId !== null) {
      search.set("parentFolderId", params.parentFolderId);
    }
    if (params.q) search.set("q", params.q);
    return fetch(`/api/v1/folders?${search}`).then((res) =>
      parseJson<{ folders: FloxFolder[] }>(res),
    );
  },

  get(id: string) {
    return fetch(`/api/v1/folders/${id}`).then((res) =>
      parseJson<{ folder: FloxFolder }>(res),
    );
  },

  create(payload: CreateFolderPayload) {
    return fetch("/api/v1/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ folder: FloxFolder }>(res));
  },

  update(
    id: string,
    payload: Partial<CreateFolderPayload> & {
      isFavorite?: boolean;
      isPinned?: boolean;
      isLocked?: boolean;
    },
  ) {
    return fetch(`/api/v1/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ folder: FloxFolder }>(res));
  },

  remove(id: string) {
    return fetch(`/api/v1/folders/${id}`, { method: "DELETE" }).then((res) =>
      parseJson<{ folder: FloxFolder }>(res),
    );
  },

  move(id: string, parentFolderId: string | null) {
    return fetch(`/api/v1/folders/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentFolderId }),
    }).then((res) => parseJson<{ folder: FloxFolder }>(res));
  },

  duplicate(id: string) {
    return fetch(`/api/v1/folders/${id}/duplicate`, { method: "POST" }).then(
      (res) => parseJson<{ folder: FloxFolder }>(res),
    );
  },

  suggest(payload: {
    workspaceId: string;
    projectId: string;
    prompt: string;
  }) {
    return fetch("/api/v1/folders/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) =>
      parseJson<{ suggestions: FolderSuggestion[]; prompt: string }>(res),
    );
  },

  applySuggestions(payload: {
    workspaceId: string;
    projectId: string;
    parentFolderId?: string | null;
    folders: FolderSuggestion[];
  }) {
    return fetch("/api/v1/folders/apply-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ folders: FloxFolder[] }>(res));
  },
};
