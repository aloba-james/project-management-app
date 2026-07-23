"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { plannerService } from "@/services/planner.service";
import type { CreatePlannerPayload } from "@/types/planner";

export const plannerKeys = {
  all: ["planner"] as const,
  list: (workspaceId: string) =>
    [...plannerKeys.all, "list", workspaceId] as const,
  detail: (id: string) => [...plannerKeys.all, "detail", id] as const,
};

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlannerPayload) =>
      plannerService.create(payload),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({
        queryKey: plannerKeys.list(vars.workspaceId),
      });
    },
  });
}

export function usePlans(workspaceId: string | undefined) {
  return useQuery({
    queryKey: plannerKeys.list(workspaceId ?? ""),
    queryFn: () => plannerService.list(workspaceId!),
    enabled: Boolean(workspaceId),
    select: (data) => data.plans,
  });
}

export function usePlan(id: string | undefined) {
  return useQuery({
    queryKey: plannerKeys.detail(id ?? ""),
    queryFn: () => plannerService.get(id!),
    enabled: Boolean(id),
    select: (data) => data.plan,
  });
}

export function useApprovePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plannerService.approve(id),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: plannerKeys.all });
      void qc.invalidateQueries({
        queryKey: plannerKeys.detail(data.plan.id),
      });
    },
  });
}

export function useCancelPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plannerService.cancel(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: plannerKeys.all });
    },
  });
}

export function useResumePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, confirm }: { id: string; confirm?: boolean }) =>
      plannerService.resume(id, confirm),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: plannerKeys.all });
      void qc.invalidateQueries({ queryKey: ["objects"] });
      void qc.invalidateQueries({ queryKey: ["brain"] });
    },
  });
}
