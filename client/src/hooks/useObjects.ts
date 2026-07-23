"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { objectService } from "@/services/object.service";
import type {
  CreateObjectPayload,
  ObjectType,
  UpdateObjectPayload,
} from "@/types/object";

export const objectKeys = {
  all: ["objects"] as const,
  list: (workspaceId: string, filters = "") =>
    [...objectKeys.all, "list", workspaceId, filters] as const,
  search: (workspaceId: string, q: string, objectType = "") =>
    [...objectKeys.all, "search", workspaceId, q, objectType] as const,
  detail: (id: string) => [...objectKeys.all, "detail", id] as const,
  aiContext: (workspaceId: string, root = "") =>
    [...objectKeys.all, "ai-context", workspaceId, root] as const,
};

export function useObjects(params: {
  workspaceId: string | undefined;
  objectType?: ObjectType;
  q?: string;
}) {
  const filters = `${params.objectType ?? ""}:${params.q ?? ""}`;
  return useQuery({
    queryKey: objectKeys.list(params.workspaceId ?? "", filters),
    queryFn: () =>
      objectService.list({
        workspaceId: params.workspaceId!,
        objectType: params.objectType,
        q: params.q,
      }),
    enabled: Boolean(params.workspaceId),
    select: (data) => data.objects,
  });
}

export function useObjectSearch(params: {
  workspaceId: string | undefined;
  q: string;
  objectType?: ObjectType;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: objectKeys.search(
      params.workspaceId ?? "",
      params.q,
      params.objectType ?? "",
    ),
    queryFn: () =>
      objectService.search({
        workspaceId: params.workspaceId!,
        q: params.q,
        objectType: params.objectType,
      }),
    enabled:
      Boolean(params.workspaceId) &&
      params.q.trim().length >= 1 &&
      (params.enabled ?? true),
    select: (data) => data.objects,
  });
}

export function useObject(id: string | undefined) {
  return useQuery({
    queryKey: objectKeys.detail(id ?? ""),
    queryFn: () => objectService.get(id!),
    enabled: Boolean(id),
    select: (data) => data.object,
  });
}

export function useCreateObject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateObjectPayload) => objectService.create(payload),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({
        queryKey: [...objectKeys.all, "list", vars.workspaceId],
      });
    },
  });
}

export function useUpdateObject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateObjectPayload) =>
      objectService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: objectKeys.all });
      void qc.invalidateQueries({ queryKey: objectKeys.detail(id) });
    },
  });
}

export function useDeleteObject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => objectService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: objectKeys.all });
    },
  });
}

export function useAiContext(params: {
  workspaceId: string | undefined;
  rootObjectId?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: objectKeys.aiContext(
      params.workspaceId ?? "",
      params.rootObjectId ?? "",
    ),
    queryFn: () =>
      objectService.aiContext({
        workspaceId: params.workspaceId!,
        rootObjectId: params.rootObjectId,
      }),
    enabled: Boolean(params.workspaceId) && (params.enabled ?? true),
    select: (data) => data.objects,
  });
}
