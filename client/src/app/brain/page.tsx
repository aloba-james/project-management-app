"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { WorkspaceBrainPanel } from "@/components/brain/WorkspaceBrainPanel";
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

export default function BrainPage() {
  const { data: workspaces = [], isLoading } = useWorkspaces({
    status: "Active",
  });
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const [workspaceId, setWorkspaceId] = useState<string>("");

  useEffect(() => {
    const next = activeWorkspaceId ?? workspaces[0]?.id ?? "";
    if (next) setWorkspaceId(next);
  }, [activeWorkspaceId, workspaces]);

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-8">
      <Header name="Flox Brain" />
      <p className="mb-6 text-sm text-muted-foreground">
        Central orchestration for intent, context, planning, and execution.
        Models are selected by adapters — the UI never calls an LLM directly.
        Prefer creating an execution plan before running the Brain.
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
        <>
          <ExecutionPreviewPanel workspaceId={workspaceId} />
          <WorkspaceBrainPanel workspaceId={workspaceId} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Create or select a workspace to use the Brain.
        </p>
      )}
    </div>
  );
}
