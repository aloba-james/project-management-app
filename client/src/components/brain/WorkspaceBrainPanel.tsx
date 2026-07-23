"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  useBrainExecute,
  useBrainExecutions,
  useBrainPlan,
} from "@/hooks/useBrain";
import type { BrainExecutionResult, BrainPlan } from "@/types/brain";

type Props = {
  workspaceId: string;
  compact?: boolean;
};

export function WorkspaceBrainPanel({ workspaceId, compact }: Props) {
  const [prompt, setPrompt] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [plan, setPlan] = useState<BrainPlan | null>(null);
  const [execution, setExecution] = useState<BrainExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planMutation = useBrainPlan();
  const executeMutation = useBrainExecute();
  const { data: history = [] } = useBrainExecutions(workspaceId);

  const handlePlan = async () => {
    setError(null);
    setExecution(null);
    try {
      const res = await planMutation.mutateAsync({ workspaceId, prompt });
      setPlan(res.plan);
      setConfirm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Plan failed");
    }
  };

  const handleExecute = async () => {
    setError(null);
    try {
      const res = await executeMutation.mutateAsync({
        workspaceId,
        prompt,
        confirm,
      });
      setExecution(res.execution);
      setPlan(res.execution);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Execute failed");
    }
  };

  return (
    <section className={compact ? "mt-8" : "mt-10"}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Flox Brain</h2>
          <p className="text-sm text-muted-foreground">
            Plan and execute work through the Brain — never call models directly.
          </p>
        </div>
        {!compact && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/brain">Open Brain console</Link>
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3 rounded-xl border p-4">
        <div className="space-y-2">
          <Label htmlFor="brain-prompt">Prompt</Label>
          <Textarea
            id="brain-prompt"
            rows={compact ? 3 : 4}
            placeholder='e.g. Create a proposal for Q3 marketing'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={!prompt.trim() || planMutation.isPending}
            onClick={() => void handlePlan()}
          >
            {planMutation.isPending ? "Planning…" : "Plan"}
          </Button>
          <Button
            disabled={!prompt.trim() || executeMutation.isPending}
            onClick={() => void handleExecute()}
          >
            {executeMutation.isPending ? "Executing…" : "Execute"}
          </Button>
          {(plan?.requiresConfirmation ||
            execution?.status === "AwaitingConfirmation") && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
              />
              Confirm dangerous actions
            </label>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {plan && (
        <div className="mt-4 rounded-xl border p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{plan.intent}</Badge>
            <Badge variant="outline">{plan.agent}</Badge>
            <Badge variant="outline">
              {plan.modelProvider}/{plan.modelId}
            </Badge>
            {plan.requiresConfirmation && (
              <Badge variant="destructive">Needs confirmation</Badge>
            )}
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {plan.plan.map((step) => (
              <li key={step.id}>
                <span className="font-medium">{step.tool}</span> —{" "}
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      )}

      {execution && (
        <div className="mt-4 rounded-xl border p-4 text-sm">
          <p>
            Status: <strong>{execution.status}</strong> · {execution.durationMs}
            ms
          </p>
          {execution.error && (
            <p className="mt-2 text-destructive">{execution.error}</p>
          )}
          {execution.result.text && (
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs">
              {execution.result.text}
            </pre>
          )}
          {execution.result.objectIds.length > 0 && (
            <ul className="mt-3 space-y-1">
              {execution.result.objectIds.map((id) => (
                <li key={id}>
                  <Link
                    className="underline"
                    href={`/workspaces/${workspaceId}/objects/${id}`}
                  >
                    Created object {id.slice(0, 8)}…
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!compact && history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Recent executions
          </h3>
          <ul className="mt-2 divide-y rounded-lg border text-sm">
            {history.slice(0, 5).map((row) => (
              <li key={row.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{row.intent}</Badge>
                  <Badge variant="secondary">{row.status}</Badge>
                  <span className="text-muted-foreground">
                    {new Date(row.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1">{row.prompt}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
