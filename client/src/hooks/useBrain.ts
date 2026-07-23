"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { brainService } from "@/services/brain.service";
import type { BrainPromptPayload } from "@/types/brain";

export const brainKeys = {
  all: ["brain"] as const,
  executions: (workspaceId: string) =>
    [...brainKeys.all, "executions", workspaceId] as const,
};

export function useBrainPlan() {
  return useMutation({
    mutationFn: (payload: BrainPromptPayload) => brainService.plan(payload),
  });
}

export function useBrainExecute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BrainPromptPayload) => brainService.execute(payload),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({
        queryKey: brainKeys.executions(vars.workspaceId),
      });
      void qc.invalidateQueries({ queryKey: ["objects"] });
    },
  });
}

export function useBrainExecutions(workspaceId: string | undefined) {
  return useQuery({
    queryKey: brainKeys.executions(workspaceId ?? ""),
    queryFn: () => brainService.executions(workspaceId!),
    enabled: Boolean(workspaceId),
    select: (data) => data.executions,
  });
}
