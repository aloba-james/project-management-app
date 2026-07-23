"use client";

import { WorkspaceCard } from "./WorkspaceCard";
import type { Workspace } from "@/types/workspace";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  workspaces: Workspace[];
  isLoading?: boolean;
};

export function WorkspaceGrid({ workspaces, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
