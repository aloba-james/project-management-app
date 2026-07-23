"use client";

import Header from "@/components/Header";
import ModalNewTask from "@/app/projects/ModalNewTask";
import ModalTaskDetails from "@/app/projects/ModalTaskDetails";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Priority, Task, useGetTasksQuery } from "@/state/api";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.status || "—"}</Badge>
    ),
  },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "tags", header: "Tags" },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) =>
      row.original.dueDate
        ? new Date(row.original.dueDate).toLocaleDateString()
        : "—",
  },
  {
    id: "author",
    header: "Author",
    cell: ({ row }) => row.original.author?.username || "Unknown",
  },
  {
    id: "assignee",
    header: "Assignee",
    cell: ({ row }) => row.original.assignee?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const filteredTasks =
    tasks?.filter((task: Task) => task.priority === priority) || [];

  if (isError || !tasks) return <div className="p-8">Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <ModalTaskDetails
        taskId={selectedTaskId}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
      />
      <Header
        name={`${priority} Priority Tasks`}
        buttonComponent={
          <Button onClick={() => setIsModalNewTaskOpen(true)}>Add Task</Button>
        }
      />
      <div className="mb-4 inline-flex overflow-hidden rounded-md border">
        <Button
          variant={view === "list" ? "default" : "ghost"}
          className="rounded-none"
          onClick={() => setView("list")}
        >
          List
        </Button>
        <Button
          variant={view === "table" ? "default" : "ghost"}
          className="rounded-none"
          onClick={() => setView("table")}
        >
          Table
        </Button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredTasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={setSelectedTaskId}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTasks}
          onRowClick={(row) => setSelectedTaskId(row.id)}
        />
      )}
    </div>
  );
};

export default ReusablePriorityPage;
