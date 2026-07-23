"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { folderApi } from "@/services/folder.service";
import type { CreateFolderPayload, FolderSuggestion } from "@/types/folder";

export const folderKeys = {
  all: ["flox-folders"] as const,
  list: (projectId: string, parent = "root") =>
    [...folderKeys.all, "list", projectId, parent] as const,
  detail: (id: string) => [...folderKeys.all, "detail", id] as const,
};

export function useFolders(params: {
  workspaceId: string | undefined;
  projectId: string | undefined;
  rootOnly?: boolean;
}) {
  const projectId = params.projectId ?? "";
  return useQuery({
    queryKey: folderKeys.list(projectId, params.rootOnly ? "root" : "all"),
    queryFn: () =>
      folderApi.list({
        workspaceId: params.workspaceId!,
        projectId,
        rootOnly: params.rootOnly,
      }),
    enabled: Boolean(params.workspaceId && params.projectId),
    select: (data) => data.folders,
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => folderApi.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useUpdateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & Partial<CreateFolderPayload> & {
        isFavorite?: boolean;
        isPinned?: boolean;
        isLocked?: boolean;
      }) => folderApi.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folderApi.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useSuggestFolders() {
  return useMutation({
    mutationFn: (payload: {
      workspaceId: string;
      projectId: string;
      prompt: string;
    }) => folderApi.suggest(payload),
  });
}

export function useApplyFolderSuggestions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      workspaceId: string;
      projectId: string;
      folders: FolderSuggestion[];
    }) => folderApi.applySuggestions(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}
