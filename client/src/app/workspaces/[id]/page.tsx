"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { WorkspaceBriefing } from "@/components/flox/WorkspaceBriefing";
import { WorkspaceProjectsSection } from "@/components/projects/WorkspaceProjectsSection";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: workspace, isLoading, isError, error } = useWorkspace(id);
  const { data: floxProjects = [] } = useProjects({ workspaceId: id });
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);

  useEffect(() => {
    if (id) setActiveWorkspaceId(id);
  }, [id, setActiveWorkspaceId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8 pb-32">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
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
    <div className="mx-auto max-w-3xl p-6 pb-32 md:p-10">
      <WorkspaceBriefing workspace={workspace} projects={floxProjects} />

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            What would you like Flox to do?
          </h2>
          <Link
            href={`/workspaces/${workspace.id}/settings`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the Goal bar below — or open a project to keep working.
        </p>
      </section>

      <div className="mt-10">
        <WorkspaceProjectsSection workspaceId={workspace.id} />
      </div>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Recent activity
        </h2>
        <ul className="mt-4 space-y-3">
          {workspace.recentActivity?.length ? (
            workspace.recentActivity.slice(0, 8).map((a) => (
              <li key={a.id} className="text-sm">
                <span className="font-medium">
                  {a.action.replace(/\./g, " ")}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  · {a.user?.username ?? "System"} ·{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">
              Actions will appear here as Flox and your team work.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
