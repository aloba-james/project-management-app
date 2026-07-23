"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "@/app/projects/BoardView";
import List from "@/app/projects/ListView";
import Timeline from "@/app/projects/TimelineView";
import Table from "@/app/projects/TableView";
import ModalNewTask from "@/app/projects/ModalNewTask";
import ModalTaskDetails from "@/app/projects/ModalTaskDetails";

type Props = {
  /** Legacy Express Project.id (task board) */
  boardId: string;
  /** Optional back-link to Flox project overview */
  overviewHref?: string;
  title?: string;
};

/**
 * Shared task board shell (Board / List / Timeline / Table).
 * boardId is always the Int Express Project id, not a Flox UUID.
 */
export function TaskBoardShell({ boardId, overviewHref, title }: Props) {
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [newTaskDefaults, setNewTaskDefaults] = useState<{
    startDate?: string;
    dueDate?: string;
  }>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const openNewTask = (defaults?: { startDate?: string; dueDate?: string }) => {
    setNewTaskDefaults(defaults ?? {});
    setIsModalNewTaskOpen(true);
  };

  const closeNewTask = () => {
    setIsModalNewTaskOpen(false);
    setNewTaskDefaults({});
  };

  return (
    <div>
      {overviewHref && (
        <div className="flex items-center justify-between gap-3 border-b px-6 py-3 text-sm">
          <Link
            href={overviewHref}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Project overview
          </Link>
          {title ? (
            <span className="font-medium text-foreground">{title}</span>
          ) : null}
        </div>
      )}
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={closeNewTask}
        id={boardId}
        initialStartDate={newTaskDefaults.startDate}
        initialDueDate={newTaskDefaults.dueDate}
      />
      <ModalTaskDetails
        taskId={selectedTaskId}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
      />
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectId={boardId}
      />
      {activeTab === "Board" && (
        <Board
          id={boardId}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "List" && (
        <List
          id={boardId}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "Timeline" && (
        <Timeline
          id={boardId}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "Table" && (
        <Table
          id={boardId}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
    </div>
  );
}
