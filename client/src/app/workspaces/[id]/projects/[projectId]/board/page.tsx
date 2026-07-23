"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskBoardShell } from "@/components/projects/TaskBoardShell";
import { useProject } from "@/hooks/useProjects";

export default function ProjectTaskBoardPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id: workspaceId, projectId } = use(params);
  const { data: project, isLoading, isError, error } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
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

  if (!project.boardProjectId) {
    return (
      <div className="p-8 text-muted-foreground">
        Setting up task board…
      </div>
    );
  }

  return (
    <TaskBoardShell
      boardId={String(project.boardProjectId)}
      title={project.name}
      overviewHref={`/workspaces/${workspaceId}/projects/${projectId}`}
    />
  );
}
