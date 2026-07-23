import type {
  CreateObjectPayload,
  FloxObject,
  FloxObjectDetail,
  ObjectActivity,
  ObjectPermission,
  ObjectRelationshipEdge,
  ObjectRelationshipType,
  ObjectType,
  UpdateObjectPayload,
} from "@/types/object";

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

export const objectService = {
  list(params: {
    workspaceId: string;
    objectType?: ObjectType;
    status?: string;
    q?: string;
  }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    if (params.objectType) search.set("objectType", params.objectType);
    if (params.status) search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    return fetch(`/api/v1/objects?${search}`).then((res) =>
      parseJson<{ objects: FloxObject[] }>(res),
    );
  },

  search(params: {
    workspaceId: string;
    q: string;
    objectType?: ObjectType;
  }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    search.set("q", params.q);
    if (params.objectType) search.set("objectType", params.objectType);
    return fetch(`/api/v1/objects/search?${search}`).then((res) =>
      parseJson<{ objects: FloxObject[]; q: string }>(res),
    );
  },

  get(id: string) {
    return fetch(`/api/v1/objects/${id}`).then((res) =>
      parseJson<{ object: FloxObjectDetail }>(res),
    );
  },

  create(payload: CreateObjectPayload) {
    return fetch("/api/v1/objects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ object: FloxObject }>(res));
  },

  update(id: string, payload: UpdateObjectPayload) {
    return fetch(`/api/v1/objects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<{ object: FloxObject }>(res));
  },

  remove(id: string) {
    return fetch(`/api/v1/objects/${id}`, { method: "DELETE" }).then((res) =>
      parseJson<{ object: FloxObject }>(res),
    );
  },

  relationships(id: string) {
    return fetch(`/api/v1/objects/${id}/relationships`).then((res) =>
      parseJson<{
        relationships: {
          outbound: ObjectRelationshipEdge[];
          inbound: ObjectRelationshipEdge[];
        };
      }>(res),
    );
  },

  createRelationship(
    id: string,
    payload: {
      targetObjectId: string;
      relationshipType: ObjectRelationshipType;
    },
  ) {
    return fetch(`/api/v1/objects/${id}/relationships`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) =>
      parseJson<{ relationship: ObjectRelationshipEdge }>(res),
    );
  },

  activity(id: string) {
    return fetch(`/api/v1/objects/${id}/activity`).then((res) =>
      parseJson<{ activities: ObjectActivity[] }>(res),
    );
  },

  permissions(id: string) {
    return fetch(`/api/v1/objects/${id}/permissions`).then((res) =>
      parseJson<{ permissions: ObjectPermission[] }>(res),
    );
  },

  aiContext(params: { workspaceId: string; rootObjectId?: string }) {
    const search = new URLSearchParams();
    search.set("workspaceId", params.workspaceId);
    if (params.rootObjectId) search.set("rootObjectId", params.rootObjectId);
    return fetch(`/api/v1/objects/ai-context?${search}`).then((res) =>
      parseJson<{ objects: FloxObject[]; rootObjectId?: string }>(res),
    );
  },
};
