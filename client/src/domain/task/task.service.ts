/**
 * Thin HTTP adapter to the Express Task API.
 * Full migration into Universal Objects is out of scope (ARCH-001).
 */

const apiBase = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function expressFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };
  if (init?.token) {
    (headers as Record<string, string>).Authorization = `Bearer ${init.token}`;
  }

  const res = await fetch(`${apiBase()}/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Express Task API ${res.status}: ${text || res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

export const taskService = {
  name: "task-service",
  mode: "express-adapter" as const,

  list(projectId?: string | number, token?: string) {
    const path =
      projectId !== undefined ? `tasks?projectId=${projectId}` : "tasks";
    return expressFetch<unknown>(path, { token });
  },

  get(taskId: string | number, token?: string) {
    return expressFetch<unknown>(`tasks/${taskId}`, { token });
  },

  create(body: unknown, token?: string) {
    return expressFetch<unknown>("tasks", {
      method: "POST",
      body: JSON.stringify(body),
      token,
    });
  },

  updateStatus(taskId: string | number, status: string, token?: string) {
    return expressFetch<unknown>(`tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    });
  },

  async health() {
    try {
      const res = await fetch(`${apiBase()}/`, { method: "GET" });
      return {
        ok: res.ok || res.status < 500,
        detail: `express ${apiBase()} status=${res.status}`,
      };
    } catch (err) {
      return {
        ok: false,
        detail: err instanceof Error ? err.message : "unreachable",
      };
    }
  },
};
