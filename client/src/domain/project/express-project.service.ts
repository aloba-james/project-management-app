/**
 * Thin HTTP adapter to the Express Project API (legacy task board).
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
      `Express Project API ${res.status}: ${text || res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

export const expressProjectService = {
  name: "express-project-service",
  mode: "express-adapter" as const,

  list(token?: string) {
    return expressFetch<unknown>("projects", { token });
  },

  get(projectId: string | number, token?: string) {
    return expressFetch<unknown>(`projects/${projectId}`, { token });
  },

  create(body: unknown, token?: string) {
    return expressFetch<unknown>("projects", {
      method: "POST",
      body: JSON.stringify(body),
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

/** @deprecated Use expressProjectService */
export const projectService = expressProjectService;
