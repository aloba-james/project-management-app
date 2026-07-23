"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "@/types/workspace";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  list: (status = "Active", q = "") =>
    [...workspaceKeys.all, "list", status, q] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
};

export function useWorkspaces(params?: { status?: string; q?: string }) {
  const status = params?.status ?? "Active";
  const q = params?.q ?? "";
  return useQuery({
    queryKey: workspaceKeys.list(status, q),
    queryFn: () => workspaceService.list({ status, q }),
    select: (data) => data.workspaces,
  });
}

export function useWorkspace(id: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.detail(id ?? ""),
    queryFn: () => workspaceService.get(id!),
    enabled: Boolean(id),
    select: (data) => data.workspace,
  });
}

export function useCreateWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) =>
      workspaceService.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useUpdateWorkspace(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWorkspacePayload) =>
      workspaceService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: workspaceKeys.all });
      void qc.invalidateQueries({ queryKey: workspaceKeys.detail(id) });
    },
  });
}

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspaceService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useArchiveWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspaceService.archive(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useRestoreWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspaceService.restore(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useAiSuggestions() {
  return useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string | null;
      prompt?: string | null;
    }) => workspaceService.aiSuggestions(payload),
  });
}

export function useEnsurePersonalWorkspace(enabled = true) {
  return useQuery({
    queryKey: [...workspaceKeys.all, "ensure-personal"],
    queryFn: () => workspaceService.ensurePersonal(),
    enabled,
    staleTime: Infinity,
  });
}
