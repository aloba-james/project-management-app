"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  useApprovePlan,
  useCancelPlan,
  useCreatePlan,
  usePlans,
  useResumePlan,
} from "@/hooks/usePlanner";
import type { ExecutionPlan } from "@/types/planner";

type Props = {
  workspaceId: string;
};

export function ExecutionPreviewPanel({ workspaceId }: Props) {
  const [prompt, setPrompt] = useState("");
  const [active, setActive] = useState<ExecutionPlan | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCreatePlan();
  const approve = useApprovePlan();
  const cancel = useCancelPlan();
  const resume = useResumePlan();
  const { data: plans = [] } = usePlans(workspaceId);

  const handleCreate = async () => {
    setError(null);
    try {
      const res = await create.mutateAsync({ workspaceId, prompt });
      setActive(res.plan);
      setConfirm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create plan");
    }
  };

  const warnings = Array.isArray(active?.warnings)
    ? (active?.warnings as string[])
    : [];

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Execution Planner</h2>
          <p className="text-sm text-muted-foreground">
            Convert goals into persisted plans before any AI execution.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/planner">Open planner</Link>
        </Button>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border p-4">
        <div className="space-y-2">
          <Label htmlFor="planner-prompt">Goal / prompt</Label>
          <Textarea
            id="planner-prompt"
            rows={3}
            placeholder='e.g. Create proposal for ABC Hospital'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <Button
          disabled={!prompt.trim() || create.isPending}
          onClick={() => void handleCreate()}
        >
          {create.isPending ? "Creating plan…" : "Create plan"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {active && (
        <div className="mt-4 space-y-4 rounded-xl border p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{active.intent}</Badge>
            <Badge variant="outline">{active.complexity}</Badge>
            <Badge variant="outline">{active.strategy}</Badge>
            <Badge variant="outline">{active.status}</Badge>
            {active.approvalRequired && (
              <Badge variant="destructive">Approval required</Badge>
            )}
          </div>
          <div>
            <h3 className="font-medium">{active.goal}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {active.summary}
            </p>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              Est. time: <strong>{active.estimatedDuration}s</strong>
            </div>
            <div>
              Est. tokens: <strong>{active.estimatedTokens}</strong>
            </div>
            <div>
              Est. cost: <strong>{active.estimatedCost}¢</strong>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Steps</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
              {active.steps?.map((s) => (
                <li key={s.id}>
                  <span className="font-medium">{s.title}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {s.agent} · {s.tool}
                    {s.model ? ` · ${s.model}` : ""}
                    {s.approvalRequired ? " · needs approval" : ""}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {(active.requiredTools.length > 0 ||
            active.requiredAgents.length > 0) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {active.requiredAgents.map((a) => (
                <Badge key={a} variant="secondary">
                  Agent: {a}
                </Badge>
              ))}
              {active.requiredTools.map((t) => (
                <Badge key={t} variant="outline">
                  Tool: {t}
                </Badge>
              ))}
              {active.requiredModels.map((m) => (
                <Badge key={m} variant="outline">
                  Model: {m}
                </Badge>
              ))}
            </div>
          )}

          {warnings.length > 0 && (
            <ul className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {active.status === "PendingApproval" && (
              <Button
                disabled={approve.isPending}
                onClick={() =>
                  void approve.mutateAsync(active.id).then((r) => setActive(r.plan))
                }
              >
                Approve
              </Button>
            )}
            {["Approved", "Paused", "Failed"].includes(active.status) && (
              <>
                <Button
                  disabled={resume.isPending}
                  onClick={() =>
                    void resume
                      .mutateAsync({ id: active.id, confirm })
                      .then((r) => setActive(r.plan))
                  }
                >
                  {resume.isPending ? "Running…" : "Resume / Execute"}
                </Button>
                {active.approvalRequired && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={confirm}
                      onChange={(e) => setConfirm(e.target.checked)}
                    />
                    Confirm dangerous steps
                  </label>
                )}
              </>
            )}
            {!["Completed", "Cancelled"].includes(active.status) && (
              <Button
                variant="outline"
                disabled={cancel.isPending}
                onClick={() =>
                  void cancel.mutateAsync(active.id).then((r) => setActive(r.plan))
                }
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Recent plans
          </h3>
          <ul className="mt-2 divide-y rounded-lg border text-sm">
            {plans.slice(0, 8).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-accent/40"
                  onClick={() => setActive(p)}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{p.status}</Badge>
                    <Badge variant="secondary">{p.complexity}</Badge>
                  </div>
                  <span className="mt-1 line-clamp-1">{p.goal}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
