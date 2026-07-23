"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectAiOverview } from "@/components/flox/ProjectAiOverview";
import { ProjectFoldersPanel } from "@/components/projects/ProjectFoldersPanel";
import { ProjectFilesPanel } from "@/components/projects/ProjectFilesPanel";
import {
  useArchiveProject,
  useDuplicateProject,
  useProject,
} from "@/hooks/useProjects";

export default function FloxProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id: workspaceId, projectId } = use(params);
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const archive = useArchiveProject();
  const duplicate = useDuplicateProject();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8 pb-32">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-8 text-destructive">
        {(error as Error)?.message || "Project not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 pb-32 md:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" className="gap-2 px-0" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="h-4 w-4" />
            Workspace
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/projects/${project.id}/board`}>
              Task board
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={duplicate.isPending}
            onClick={() => void duplicate.mutateAsync(project.id)}
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={archive.isPending || project.status === "Archived"}
            onClick={() => void archive.mutateAsync(project.id)}
          >
            Archive
          </Button>
        </div>
      </div>

      <div id="overview">
        <ProjectAiOverview workspaceId={workspaceId} project={project} />
      </div>

      <div id="folders">
        <ProjectFoldersPanel
          workspaceId={workspaceId}
          projectId={project.id}
        />
      </div>
      <div id="files">
        <ProjectFilesPanel workspaceId={workspaceId} projectId={project.id} />
      </div>
    </div>
  );
}
