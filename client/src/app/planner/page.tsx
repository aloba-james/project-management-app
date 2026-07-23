"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ExecutionPreviewPanel } from "@/components/planner/ExecutionPreviewPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function PlannerPage() {
  const { data: workspaces = [], isLoading } = useWorkspaces({
    status: "Active",
  });
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const [workspaceId, setWorkspaceId] = useState("");

  useEffect(() => {
    const next = activeWorkspaceId ?? workspaces[0]?.id ?? "";
    if (next) setWorkspaceId(next);
  }, [activeWorkspaceId, workspaces]);

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-8">
      <Header name="Execution Planner" />
      <p className="mb-6 text-sm text-muted-foreground">
        Every meaningful AI request becomes a persisted execution plan first.
        The planner never calls models — it only decides how work should run.
      </p>

      <div className="mb-6 max-w-sm space-y-2">
        <Label>Workspace</Label>
        <Select
          value={workspaceId}
          onValueChange={(id) => {
            setWorkspaceId(id);
            setActiveWorkspaceId(id);
          }}
          disabled={isLoading || workspaces.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {workspaceId ? (
        <ExecutionPreviewPanel workspaceId={workspaceId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a workspace to create plans.
        </p>
      )}
    </div>
  );
}
