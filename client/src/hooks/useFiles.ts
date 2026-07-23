"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fileApi } from "@/services/file.service";
import type { CreateFilePayload } from "@/types/file";

export const fileKeys = {
  all: ["flox-files"] as const,
  list: (projectId: string, q = "") =>
    [...fileKeys.all, "list", projectId, q] as const,
  detail: (id: string) => [...fileKeys.all, "detail", id] as const,
};

export function useFiles(params: {
  workspaceId: string | undefined;
  projectId: string | undefined;
  q?: string;
}) {
  const projectId = params.projectId ?? "";
  return useQuery({
    queryKey: fileKeys.list(projectId, params.q ?? ""),
    queryFn: () =>
      fileApi.list({
        workspaceId: params.workspaceId!,
        projectId,
        q: params.q,
      }),
    enabled: Boolean(params.workspaceId && params.projectId),
    select: (data) => data.files,
  });
}

export function useFile(id: string | undefined) {
  return useQuery({
    queryKey: fileKeys.detail(id ?? ""),
    queryFn: () => fileApi.get(id!),
    enabled: Boolean(id),
    select: (data) => data.file,
  });
}

export function useCreateFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFilePayload) => fileApi.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: fileKeys.all });
    },
  });
}

export function useUpdateFile(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Partial<CreateFilePayload> & {
        contentText?: string | null;
        changeSummary?: string;
      },
    ) => fileApi.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: fileKeys.all });
      void qc.invalidateQueries({ queryKey: fileKeys.detail(id) });
    },
  });
}

export function useSummarizeFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fileApi.summarize(id),
    onSuccess: (_data, id) => {
      void qc.invalidateQueries({ queryKey: fileKeys.all });
      void qc.invalidateQueries({ queryKey: fileKeys.detail(id) });
    },
  });
}

export function useRewriteFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instruction,
    }: {
      id: string;
      instruction?: string;
    }) => fileApi.rewrite(id, instruction),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: fileKeys.all });
      void qc.invalidateQueries({ queryKey: fileKeys.detail(vars.id) });
    },
  });
}

export function useDuplicateFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fileApi.duplicate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: fileKeys.all });
    },
  });
}
