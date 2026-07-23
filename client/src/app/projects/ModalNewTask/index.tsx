"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetProjectsQuery,
} from "@/state/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
  initialStartDate?: string;
  initialDueDate?: string;
};

const ModalNewTask = ({
  isOpen,
  onClose,
  id = null,
  initialStartDate = "",
  initialDueDate = "",
}: Props) => {
  const { data: session } = useSession();
  const { data: projects } = useGetProjectsQuery(undefined, {
    skip: id !== null,
  });
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (session?.user?.appUserId) {
      setAuthorUserId(String(session.user.appUserId));
    }
  }, [session?.user?.appUserId]);

  useEffect(() => {
    if (!isOpen) return;
    setStartDate(initialStartDate);
    setDueDate(initialDueDate);
  }, [isOpen, initialStartDate, initialDueDate]);

  useEffect(() => {
    if (id !== null || !projects?.length || projectId) return;
    setProjectId(String(projects[0].id));
  }, [id, projects, projectId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus(Status.ToDo);
    setPriority(Priority.Backlog);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAuthorUserId(
      session?.user?.appUserId ? String(session.user.appUserId) : "",
    );
    setAssignedUserId("");
    setProjectId("");
  };

  const handleSubmit = async () => {
    const resolvedProjectId = id !== null ? Number(id) : Number(projectId);
    if (!title || !authorUserId || !resolvedProjectId) return;

    await createTask({
      title,
      description: description || undefined,
      status,
      priority,
      tags: tags || undefined,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      authorUserId: parseInt(authorUserId, 10),
      assignedUserId: assignedUserId
        ? parseInt(assignedUserId, 10)
        : undefined,
      projectId: resolvedProjectId,
    });

    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return title && authorUserId && (id !== null || projectId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-description">Description</Label>
          <Textarea
            id="task-description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <select
              id="task-status"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <select
              id="task-priority"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-tags">Tags</Label>
          <Input
            id="task-tags"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="task-start">Start date</Label>
            <Input
              id="task-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-due">Due date</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        {!session?.user?.appUserId && (
          <div className="space-y-2">
            <Label htmlFor="task-author">Author User ID</Label>
            <Input
              id="task-author"
              placeholder="Author User ID"
              value={authorUserId}
              onChange={(e) => setAuthorUserId(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="task-assignee">Assigned User ID</Label>
          <Input
            id="task-assignee"
            placeholder="Assigned User ID (optional)"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          />
        </div>
        {id === null && (
          <div className="space-y-2">
            <Label htmlFor="task-project">Project</Label>
            <select
              id="task-project"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
