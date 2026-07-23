"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEnsurePersonalWorkspace,
  useWorkspaces,
} from "@/hooks/useWorkspaces";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useCreateProjectFromPrompt } from "@/hooks/useProjects";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GOAL_EXAMPLES = [
  "Build a SaaS startup",
  "Prepare an investor pitch",
  "Launch a marketing campaign",
  "Organize my semester",
  "Create a hospital implementation project",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Screen 1 — Workspace Home / AI command center (landing).
 */
export function HomeCommandCenter() {
  const router = useRouter();
  const {
    createDialogOpen,
    setCreateDialogOpen,
    setActiveWorkspaceId,
    activeWorkspaceId,
  } = useWorkspaceStore();

  const ensure = useEnsurePersonalWorkspace(true);
  const { data: workspaces = [], isLoading, refetch } = useWorkspaces({
    status: "Active",
  });
  const createFromPrompt = useCreateProjectFromPrompt();

  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ensure.isSuccess) void refetch();
  }, [ensure.isSuccess, ensure.dataUpdatedAt, refetch]);

  useEffect(() => {
    if (workspaces[0]?.id) setActiveWorkspaceId(workspaces[0].id);
  }, [workspaces, setActiveWorkspaceId]);

  const primary = useMemo(
    () =>
      workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0],
    [workspaces, activeWorkspaceId],
  );

  const runGoal = async (prompt: string) => {
    const text = prompt.trim();
    if (!text) return;
    if (!primary?.id) {
      setCreateDialogOpen(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { project } = await createFromPrompt.mutateAsync({
        workspaceId: primary.id,
        prompt: text,
      });
      setGoal("");
      router.push(`/workspaces/${primary.id}/projects/${project.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start from goal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--muted))_0%,_transparent_55%)]"
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col justify-center px-6 pb-28 pt-16 md:px-8">
        <p className="text-sm text-muted-foreground">{greeting()}.</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          What do you want to accomplish today?
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          Describe a goal. Flox plans the structure — you approve and keep
          working.
        </p>

        <div className="mt-10">
          <label
            htmlFor="home-goal"
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
          >
            Describe your goal
          </label>
          <textarea
            id="home-goal"
            rows={3}
            value={goal}
            disabled={busy}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void runGoal(goal);
              }
            }}
            placeholder="e.g. Create a hospital implementation project…"
            className="w-full resize-none rounded-xl border bg-background/80 px-4 py-3 text-base outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              disabled={busy || !goal.trim()}
              onClick={() => void runGoal(goal)}
            >
              {busy ? "Building…" : "Continue"}
            </Button>
            {primary && (
              <Button variant="ghost" asChild>
                <Link href={`/workspaces/${primary.id}`}>
                  Open {primary.name}
                </Link>
              </Button>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {GOAL_EXAMPLES.map((example) => (
            <li key={example}>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setGoal(example);
                  void runGoal(example);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>

        <section className="mt-16 border-t pt-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Recent workspaces
          </h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : workspaces.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                No workspace yet — Flox will create a Personal one, or you can
                start fresh.
              </p>
              <Button
                className="mt-3"
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
              >
                New workspace
              </Button>
            </div>
          ) : (
            <ul className="mt-4 divide-y">
              {workspaces.slice(0, 6).map((w) => (
                <li key={w.id}>
                  <Link
                    href={`/workspaces/${w.id}`}
                    onClick={() => setActiveWorkspaceId(w.id)}
                    className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-foreground"
                  >
                    <span className="font-medium">{w.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {w.workspaceType}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <CreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
