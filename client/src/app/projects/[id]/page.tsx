"use client";

import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "../ModalNewTask";
import ModalTaskDetails from "../ModalTaskDetails";

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
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
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={closeNewTask}
        id={id}
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
        projectId={id}
      />
      {activeTab === "Board" && (
        <Board
          id={id}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "List" && (
        <List
          id={id}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "Timeline" && (
        <Timeline
          id={id}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
      {activeTab === "Table" && (
        <Table
          id={id}
          setIsModalNewTaskOpen={(open) =>
            open ? openNewTask() : closeNewTask()
          }
          onTaskClick={setSelectedTaskId}
        />
      )}
    </div>
  );
};

export default Project;
