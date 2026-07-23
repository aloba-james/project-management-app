"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/useProjects";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/** Creates a Flox project (and its linked task board) in the active workspace. */
const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const createProject = useCreateProject();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;
    if (!activeWorkspaceId) {
      setError("Select a workspace first");
      return;
    }

    try {
      setError(null);
      const result = await createProject.mutateAsync({
        workspaceId: activeWorkspaceId,
        name: projectName,
        description: description || null,
        status: "Active",
      });
      const project = result.project;
      resetForm();
      onClose();
      router.push(
        `/workspaces/${activeWorkspaceId}/projects/${project.id}/board`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    }
  };

  const isFormValid = () => {
    return Boolean(projectName && startDate && endDate && activeWorkspaceId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {!activeWorkspaceId && (
          <p className="text-sm text-destructive">
            Choose an active workspace before creating a board.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Textarea
            id="project-description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="project-start">Start date</Label>
            <Input
              id="project-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-end">End date</Label>
            <Input
              id="project-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid() || createProject.isPending}
        >
          {createProject.isPending
            ? "Creating…"
            : "Create Project & Board"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
