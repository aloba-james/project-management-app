"use client";

import React from "react";
import { TaskBoardShell } from "@/components/projects/TaskBoardShell";

type Props = {
  params: { id: string };
};

/** Legacy board URL — prefer /workspaces/.../projects/.../board */
const Project = ({ params }: Props) => {
  return <TaskBoardShell boardId={params.id} />;
};

export default Project;
