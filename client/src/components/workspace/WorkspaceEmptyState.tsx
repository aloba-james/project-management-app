"use client";

import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
  title?: string;
  description?: string;
};

export function WorkspaceEmptyState({
  onCreate,
  title = "No workspaces yet",
  description = "Create your first workspace to organize projects, people, and work.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
        <LayoutGrid className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <Button className="mt-6 gap-2" onClick={onCreate}>
        <Plus className="h-4 w-4" />
        New Workspace
      </Button>
    </div>
  );
}
