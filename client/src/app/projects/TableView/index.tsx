"use client";

import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Task, useGetTasksQuery } from "@/state/api";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onTaskClick?: (taskId: number) => void;
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

const TableView = ({ id, setIsModalNewTaskOpen, onTaskClick }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error Occured While Fetching Tasks</div>;

  return (
    <div className="w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          isSmallText
          buttonComponent={
            <Button onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </Button>
          }
        />
      </div>
      <DataTable
        columns={columns}
        data={tasks || []}
        onRowClick={
          onTaskClick ? (row) => onTaskClick(row.id) : undefined
        }
      />
    </div>
  );
};

export default TableView;
