"use client";

import { useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceGrid } from "@/components/workspace/WorkspaceGrid";
import { WorkspaceEmptyState } from "@/components/workspace/WorkspaceEmptyState";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import {
  useEnsurePersonalWorkspace,
  useWorkspaces,
} from "@/hooks/useWorkspaces";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function WorkspaceDashboard() {
  const {
    createDialogOpen,
    setCreateDialogOpen,
    searchQuery,
    setSearchQuery,
    setActiveWorkspaceId,
  } = useWorkspaceStore();

  const ensure = useEnsurePersonalWorkspace(true);
  const { data: workspaces = [], isLoading, isError, error, refetch } =
    useWorkspaces({ status: "Active", q: searchQuery || undefined });

  useEffect(() => {
    if (ensure.isSuccess) {
      void refetch();
    }
  }, [ensure.isSuccess, ensure.dataUpdatedAt, refetch]);

  useEffect(() => {
    if (workspaces[0]?.id) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, setActiveWorkspaceId]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.description ?? "").toLowerCase().includes(q),
    );
  }, [workspaces, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Workspaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a workspace or create a new one.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search workspaces…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-8">
        {isError ? (
          <p className="text-destructive">
            {(error as Error)?.message || "Failed to load workspaces"}
          </p>
        ) : !isLoading && filtered.length === 0 ? (
          <WorkspaceEmptyState
            onCreate={() => setCreateDialogOpen(true)}
            title={
              searchQuery
                ? "No matching workspaces"
                : "Welcome — create your first workspace"
            }
            description={
              searchQuery
                ? "Try a different search, or create a new workspace."
                : "Every account needs at least one workspace. We’ll also create a Personal workspace automatically on first visit."
            }
          />
        ) : (
          <WorkspaceGrid workspaces={filtered} isLoading={isLoading} />
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent activity
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open a workspace to see its audit trail. Cross-workspace activity
          feed coming soon.
        </p>
      </section>

      <CreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
