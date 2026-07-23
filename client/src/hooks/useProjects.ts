"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { floxProjectApi } from "@/services/project.service";
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types/project";

export const projectKeys = {
  all: ["flox-projects"] as const,
  list: (workspaceId: string, status = "", q = "") =>
    [...projectKeys.all, "list", workspaceId, status, q] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
};

export function useProjects(params: {
  workspaceId: string | undefined;
  status?: string;
  q?: string;
}) {
  const workspaceId = params.workspaceId ?? "";
  return useQuery({
    queryKey: projectKeys.list(
      workspaceId,
      params.status ?? "",
      params.q ?? "",
    ),
    queryFn: () =>
      floxProjectApi.list({
        workspaceId,
        status: params.status,
        q: params.q,
      }),
    enabled: Boolean(params.workspaceId),
    select: (data) => data.projects,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: () => floxProjectApi.get(id!),
    enabled: Boolean(id),
    select: (data) => data.project,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      floxProjectApi.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) =>
      floxProjectApi.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.all });
      void qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useArchiveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => floxProjectApi.archive(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDuplicateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => floxProjectApi.duplicate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useCreateProjectFromPrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      workspaceId: string;
      prompt: string;
      name?: string;
    }) => floxProjectApi.fromPrompt(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
