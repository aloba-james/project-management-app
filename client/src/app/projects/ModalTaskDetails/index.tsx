"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
  Priority,
  Status,
  useCreateAttachmentMutation,
  useCreateCommentMutation,
  useDeleteAttachmentMutation,
  useDeleteCommentMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useUploadAttachmentMutation,
} from "@/state/api";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media";

type Props = {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

const toDateInput = (value?: string) => {
  if (!value) return "";
  try {
    return format(new Date(value), "yyyy-MM-dd");
  } catch {
    return "";
  }
};

const ModalTaskDetails = ({ taskId, isOpen, onClose }: Props) => {
  const { data: session } = useSession();
  const { data: task, isLoading: isTaskLoading } = useGetTaskQuery(taskId!, {
    skip: !taskId || !isOpen,
  });
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [createAttachment, { isLoading: isAttachingUrl }] =
    useCreateAttachmentMutation();
  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus((task.status as Status) || Status.ToDo);
    setPriority((task.priority as Priority) || Priority.Backlog);
    setTags(task.tags || "");
    setStartDate(toDateInput(task.startDate));
    setDueDate(toDateInput(task.dueDate));
    setPoints(task.points != null ? String(task.points) : "");
    setAssignedUserId(
      task.assignedUserId != null ? String(task.assignedUserId) : "",
    );
  }, [task]);

  if (!isOpen || !taskId) return null;

  const inputStyles =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  const selectStyles = inputStyles;

  const handleSave = async () => {
    if (!title.trim() || !task) return;

    await updateTask({
      taskId: task.id,
      data: {
        title: title.trim(),
        description: description || undefined,
        status,
        priority,
        tags: tags || undefined,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        points: points ? Number(points) : undefined,
        assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
      },
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await deleteTask(task.id);
    onClose();
  };

  const handleAddComment = async () => {
    const userId = session?.user?.appUserId;
    if (!commentText.trim() || !userId || !task) return;

    await createComment({
      text: commentText.trim(),
      taskId: task.id,
      userId,
    });
    setCommentText("");
  };

  const handleAddAttachment = async () => {
    const userId = session?.user?.appUserId;
    if (!fileURL.trim() || !userId || !task) return;

    await createAttachment({
      fileURL: fileURL.trim(),
      fileName: fileName.trim() || undefined,
      taskId: task.id,
      uploadedById: userId,
    });
    setFileURL("");
    setFileName("");
  };

  const handleUploadFile = async () => {
    const userId = session?.user?.appUserId;
    if (!selectedFile || !userId || !task) return;

    await uploadAttachment({
      file: selectedFile,
      taskId: task.id,
      uploadedById: userId,
    });
    setSelectedFile(null);
  };

  const resolveImageSrc = (url: string) => resolveMediaUrl(url);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Task Details">
      {isTaskLoading || !task ? (
        <div className="py-8 text-center text-gray-500">Loading task...</div>
      ) : (
        <div className="mt-2 max-h-[75vh] space-y-6 overflow-y-auto pr-1">
          <section className="space-y-3">
            <input
              type="text"
              className={inputStyles}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className={inputStyles}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                className={selectStyles}
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value={Status.ToDo}>To Do</option>
                <option value={Status.WorkInProgress}>Work In Progress</option>
                <option value={Status.UnderReview}>Under Review</option>
                <option value={Status.Completed}>Completed</option>
              </select>
              <select
                className={selectStyles}
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
            <input
              type="text"
              className={inputStyles}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="date"
                className={inputStyles}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className={inputStyles}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <input
                type="number"
                className={inputStyles}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Points"
              />
            </div>
            <input
              type="text"
              className={inputStyles}
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              placeholder="Assigned User ID (optional)"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isUpdating || !title.trim()}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Task"}
              </Button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold dark:text-white">
              Attachments
            </h3>
            <div className="mb-3 space-y-2">
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-start justify-between gap-3 rounded border border-gray-200 p-2 dark:border-dark-tertiary"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium dark:text-white">
                        {attachment.fileName || "Attachment"}
                      </p>
                      <div className="relative mt-2 h-24 w-full max-w-xs overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageSrc(attachment.fileURL)}
                          alt={attachment.fileName || "attachment"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() =>
                        deleteAttachment({
                          attachmentId: attachment.id,
                          taskId: task.id,
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attachments yet.</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className={inputStyles}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleUploadFile}
                disabled={
                  isUploading || !selectedFile || !session?.user?.appUserId
                }
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
              <p className="text-xs text-muted-foreground">Or paste an image URL:</p>
              <input
                type="url"
                className={inputStyles}
                placeholder="Image URL (https://...)"
                value={fileURL}
                onChange={(e) => setFileURL(e.target.value)}
              />
              <input
                type="text"
                className={inputStyles}
                placeholder="File name (optional)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddAttachment}
                disabled={
                  isAttachingUrl || !fileURL.trim() || !session?.user?.appUserId
                }
              >
                {isAttachingUrl ? "Adding..." : "Add From URL"}
              </Button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold dark:text-white">
              Comments
            </h3>
            <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded border border-gray-200 p-2 dark:border-dark-tertiary"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {comment.user?.username || `User #${comment.userId}`}
                      </span>
                      {session?.user?.appUserId === comment.userId && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-600"
                          onClick={() =>
                            deleteComment({
                              commentId: comment.id,
                              taskId: task.id,
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm dark:text-neutral-300">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
            <textarea
              className={inputStyles}
              rows={2}
              placeholder={
                session?.user?.appUserId
                  ? "Write a comment..."
                  : "Sign in to comment"
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!session?.user?.appUserId}
            />
            <Button
              type="button"
              size="sm"
              className="mt-2"
              onClick={handleAddComment}
              disabled={
                isCommenting ||
                !commentText.trim() ||
                !session?.user?.appUserId
              }
            >
              {isCommenting ? "Posting..." : "Post Comment"}
            </Button>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default ModalTaskDetails;
