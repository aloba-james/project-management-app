"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";

type Props = {
  workspaceId: string;
};

/**
 * Project list — creation prefers the Goal bar, not a CRUD form.
 */
export function WorkspaceProjectsSection({ workspaceId }: Props) {
  const { data: projects = [], isLoading } = useProjects({ workspaceId });

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Projects
        </h2>
        <p className="text-xs text-muted-foreground">
          Created from goals
        </p>
      </div>

      <ul className="mt-4 divide-y border-y">
        {isLoading ? (
          <li className="py-6 text-sm text-muted-foreground">Loading…</li>
        ) : projects.length === 0 ? (
          <li className="py-6 text-sm text-muted-foreground">
            No projects yet. Set a goal below — Flox will build the structure.
          </li>
        ) : (
          projects.map((p) => (
            <li key={p.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/workspaces/${workspaceId}/projects/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {p.aiSummary || p.description || "No summary yet"}
                  </p>
                  <Link
                    href={`/workspaces/${workspaceId}/projects/${p.id}/board`}
                    className="mt-2 inline-block text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Open task board
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline">{p.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {p.progress}%
                  </span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
