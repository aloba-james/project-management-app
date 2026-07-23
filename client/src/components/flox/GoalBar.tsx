"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useCreateProjectFromPrompt } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

type Props = {
  workspaceId?: string | null;
  className?: string;
  placeholder?: string;
  compact?: boolean;
};

/**
 * Persistent Goal Bar — navigate by intent, not menus.
 */
export function GoalBar({
  workspaceId,
  className,
  placeholder = "What would you like Flox to accomplish?",
  compact = false,
}: Props) {
  const router = useRouter();
  const storeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const resolvedWorkspaceId = workspaceId ?? storeWorkspaceId;
  const createFromPrompt = useCreateProjectFromPrompt();
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = isPending || createFromPrompt.isPending || Boolean(phase);

  const submit = () => {
    const prompt = goal.trim();
    if (!prompt) return;
    if (!resolvedWorkspaceId) {
      setError("Open a workspace first, then set a goal.");
      return;
    }
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          setPhase("Understanding goal…");
          await wait(400);
          setPhase("Finding templates…");
          await wait(350);
          setPhase("Building plan…");
          await wait(350);
          setPhase("Creating project structure…");
          const { project } = await createFromPrompt.mutateAsync({
            workspaceId: resolvedWorkspaceId,
            prompt,
          });
          setPhase("Done");
          setGoal("");
          await wait(300);
          setPhase(null);
          router.push(
            `/workspaces/${resolvedWorkspaceId}/projects/${project.id}`,
          );
        } catch (e) {
          setPhase(null);
          setError(e instanceof Error ? e.message : "Could not run goal");
        }
      })();
    });
  };

  return (
    <>
      {phase && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Flox is working
            </p>
            <p className="text-2xl font-semibold tracking-tight">{phase}</p>
            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-foreground/70" />
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
          !compact && "md:pl-64",
          className,
        )}
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="flox-goal"
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
            >
              Goal
            </label>
            <textarea
              id="flox-goal"
              rows={compact ? 1 : 2}
              value={goal}
              disabled={busy}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={placeholder}
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            {error && (
              <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
          </div>
          <Button
            size="icon"
            className="mb-0.5 h-10 w-10 shrink-0"
            disabled={busy || !goal.trim()}
            onClick={submit}
            aria-label="Run goal"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
