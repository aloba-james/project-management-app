import React from "react";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onTaskClick?: (taskId: number) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen, onTaskClick }: Props) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error Occured While Fetching Tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-8">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <Button onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </Button>
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
