"use client";

import { use } from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { WorkspaceSettingsPanels } from "@/components/workspace/WorkspaceSettingsPanels";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: workspace, isLoading, isError, error } = useWorkspace(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="p-8 text-destructive">
        {(error as Error)?.message || "Workspace not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <WorkspaceHeader workspace={workspace} showSettings={false} />
      <h2 className="mt-6 text-lg font-semibold">Settings</h2>
      <WorkspaceSettingsPanels workspace={workspace} />
    </div>
  );
}
