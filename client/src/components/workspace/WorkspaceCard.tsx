"use client";

import Link from "next/link";
import { Archive, FolderKanban, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/workspace";

type Props = {
  workspace: Workspace;
  className?: string;
};

export function WorkspaceCard({ workspace, className }: Props) {
  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className={cn(
        "group block rounded-xl border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-lg font-semibold">
          {workspace.icon || workspace.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{workspace.workspaceType}</Badge>
          {workspace.status !== "Active" && (
            <Badge variant="outline" className="gap-1">
              <Archive className="h-3 w-3" />
              {workspace.status}
            </Badge>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight group-hover:underline">
        {workspace.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {workspace.description || "No description"}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {workspace.memberCount ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <FolderKanban className="h-3.5 w-3.5" />
          {workspace.projectCount ?? 0} projects
        </span>
        {workspace.role && <span className="ml-auto">{workspace.role}</span>}
      </div>
    </Link>
  );
}
