import { useAppSelector } from "@/app/redux";
import { Button } from "@/components/ui/button";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onTaskClick?: (taskId: number) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen, onTaskClick }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  const handleTaskBarClick = (task: { id: string }) => {
    if (!onTaskClick) return;
    const numericId = Number(task.id.replace("Task-", ""));
    if (!Number.isNaN(numericId)) onTaskClick(numericId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card text-card-foreground shadow">
        <div className="timeline">
          {ganttTasks.length > 0 ? (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month ? 150 : 100
              }
              listCellWidth="100px"
              barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
              barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
              onClick={handleTaskBarClick}
            />
          ) : (
            <p className="p-4 text-sm text-muted-foreground">
              No tasks with dates yet. Add a task to see it on the timeline.
            </p>
          )}
        </div>
        <div className="px-4 pb-5 pt-1">
          <Button onClick={() => setIsModalNewTaskOpen(true)}>
            Add New Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
