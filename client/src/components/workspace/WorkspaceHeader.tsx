"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/types/workspace";

type Props = {
  workspace: Workspace;
  showSettings?: boolean;
};

export function WorkspaceHeader({ workspace, showSettings = true }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {workspace.name}
          </h1>
          <Badge variant="secondary">{workspace.workspaceType}</Badge>
          <Badge variant="outline">{workspace.status}</Badge>
          <Badge variant="outline">{workspace.plan}</Badge>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {workspace.description || "No description"}
        </p>
      </div>
      {showSettings && (
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href={`/workspaces/${workspace.id}/settings`}>
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
      )}
    </div>
  );
}
