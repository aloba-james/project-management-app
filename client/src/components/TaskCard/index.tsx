import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="mb-3 rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-dark-secondary dark:text-white">
      {/* Attachments section */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <strong className="mb-2 block text-sm font-medium">
            Attachments:{" "}
          </strong>
          <div className="flex flex-wrap gap-2">
            {task.attachments.map((attachment) => (
              <div key={attachment.id} className="relative h-32 w-full sm:w-48">
                <Image
                  src={
                    attachment.fileURL.startsWith("http")
                      ? attachment.fileURL
                      : `/${attachment.fileURL}`
                  }
                  alt={attachment.fileName}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 640px) 100vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task details */}
      <div className="space-y-2 text-sm">
        <div>
          <strong className="font-medium">Title: </strong>
          <span className="block">{task.title}</span>
        </div>

        <div>
          <strong className="font-medium">Description: </strong>
          <span className="block text-gray-600 dark:text-gray-300">
            {task.description || "No description"}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <strong className="font-medium">Status: </strong>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "Work In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status || "Not set"}
            </span>
          </div>

          <div>
            <strong className="font-medium">Priority: </strong>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs ${
                task.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "Urgent"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.priority || "Not set"}
            </span>
          </div>
        </div>

        {task.tags && (
          <div>
            <strong className="font-medium">Tags: </strong>
            <div className="mt-1 flex flex-wrap gap-1">
              {typeof task.tags === "string"
                ? task.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))
                // : Array.isArray(task.tags)
                //   ? task.tags.map((tag: string, index: number) => (
                //       <span
                //         key={index}
                //         className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                //       >
                //         {tag}
                //       </span>
                //     ))
                  : null}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <strong className="font-medium">Start Date: </strong>
            <span className="block">
              {task.startDate
                ? format(new Date(task.startDate), "PP")
                : "Not set"}
            </span>
          </div>
          <div>
            <strong className="font-medium">Due Date: </strong>
            <span className="block">
              {task.dueDate ? format(new Date(task.dueDate), "PP") : "Not set"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <strong className="font-medium">Author: </strong>
            <span className="block">{task.author?.username || "Unknown"}</span>
          </div>
          <div>
            <strong className="font-medium">Assignee: </strong>
            <span className="block">
              {task.assignee?.username || "Unassigned"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
