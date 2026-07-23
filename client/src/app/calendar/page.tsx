"use client";

import ModalNewTask from "@/app/projects/ModalNewTask";
import ModalTaskDetails from "@/app/projects/ModalTaskDetails";
import Header from "@/components/Header";
import { resolveMediaUrl } from "@/lib/media";
import { Task, User, useGetTasksQuery, useGetUsersQuery } from "@/state/api";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_TASKS = 3;

const ASSIGNEE_COLORS = [
  { bg: "bg-sky-100 dark:bg-sky-900/50", text: "text-sky-800 dark:text-sky-100", chip: "bg-sky-500" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-800 dark:text-emerald-100", chip: "bg-emerald-500" },
  { bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-900 dark:text-amber-100", chip: "bg-amber-500" },
  { bg: "bg-rose-100 dark:bg-rose-900/50", text: "text-rose-800 dark:text-rose-100", chip: "bg-rose-500" },
  { bg: "bg-violet-100 dark:bg-violet-900/50", text: "text-violet-800 dark:text-violet-100", chip: "bg-violet-500" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/50", text: "text-cyan-800 dark:text-cyan-100", chip: "bg-cyan-500" },
  { bg: "bg-orange-100 dark:bg-orange-900/50", text: "text-orange-900 dark:text-orange-100", chip: "bg-orange-500" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/50", text: "text-indigo-800 dark:text-indigo-100", chip: "bg-indigo-500" },
];

const UNASSIGNED_COLOR = {
  bg: "bg-gray-100 dark:bg-gray-700/50",
  text: "text-gray-700 dark:text-gray-200",
  chip: "bg-gray-400",
};

type AssigneeFilter = "all" | "me" | "unassigned" | number;

/** Prefer due date (Google Calendar / Teams style); fall back to start. */
const getTaskCalendarDateKeys = (task: Task): string[] => {
  const keys = new Set<string>();
  if (task.dueDate) keys.add(task.dueDate.slice(0, 10));
  if (task.startDate) keys.add(task.startDate.slice(0, 10));
  return [...keys];
};

const taskAppearsOnDay = (task: Task, day: Date) => {
  const dayKey = format(day, "yyyy-MM-dd");
  return getTaskCalendarDateKeys(task).includes(dayKey);
};

const monthHasTasks = (tasks: Task[], month: Date) => {
  const prefix = format(month, "yyyy-MM");
  return tasks.some((task) =>
    getTaskCalendarDateKeys(task).some((key) => key.startsWith(prefix)),
  );
};

const pickMonthWithTasks = (tasks: Task[], preferNear: Date): Date | null => {
  const months = new Map<string, Date>();
  for (const task of tasks) {
    for (const key of getTaskCalendarDateKeys(task)) {
      const month = startOfMonth(parseISO(key));
      months.set(format(month, "yyyy-MM"), month);
    }
  }
  if (months.size === 0) return null;

  const prefer = startOfMonth(preferNear).getTime();
  let best: Date | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const month of months.values()) {
    const distance = Math.abs(month.getTime() - prefer);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = month;
    }
  }
  return best;
};

const formatTaskDateLabel = (value?: string) => {
  if (!value) return null;
  try {
    return format(parseISO(value.slice(0, 10)), "MMM d, yyyy");
  } catch {
    return value.slice(0, 10);
  }
};

const getUserId = (user?: User | null) => user?.userId;

const colorForAssignee = (userId?: number | null) => {
  if (userId == null) return UNASSIGNED_COLOR;
  return ASSIGNEE_COLORS[userId % ASSIGNEE_COLORS.length];
};

const initials = (name?: string) => {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const AssigneeAvatar = ({
  user,
  size = "sm",
}: {
  user?: User | null;
  size?: "sm" | "md";
}) => {
  const dim = size === "sm" ? "h-5 w-5 text-[9px]" : "h-8 w-8 text-xs";
  const colors = colorForAssignee(getUserId(user));
  const src = resolveMediaUrl(user?.profilePictureUrl);

  if (src) {
    return (
      <Image
        src={src}
        alt={user?.username || "Assignee"}
        width={size === "sm" ? 20 : 32}
        height={size === "sm" ? 20 : 32}
        className={`${dim} shrink-0 rounded-full object-cover`}
        unoptimized
      />
    );
  }

  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full font-semibold text-white ${colors.chip}`}
      title={user?.username || "Unassigned"}
    >
      {initials(user?.username || "Unassigned")}
    </span>
  );
};

const CalendarPage = () => {
  const { data: session } = useSession();
  const myUserId = session?.user?.appUserId;

  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [newTaskDefaults, setNewTaskDefaults] = useState<{
    startDate?: string;
    dueDate?: string;
  }>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { data: tasks, isLoading, isError } = useGetTasksQuery();
  const { data: users } = useGetUsersQuery();
  const didAutoJump = useRef(false);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [currentMonth]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      if (assigneeFilter === "all") return true;
      if (assigneeFilter === "unassigned") return !task.assignedUserId;
      if (assigneeFilter === "me") {
        return myUserId != null && task.assignedUserId === myUserId;
      }
      return task.assignedUserId === assigneeFilter;
    });
  }, [tasks, assigneeFilter, myUserId]);

  // Seed / older data may not fall in the current month — jump once to a month with tasks.
  useEffect(() => {
    if (!tasks?.length || didAutoJump.current) return;
    if (monthHasTasks(filteredTasks, currentMonth)) {
      didAutoJump.current = true;
      return;
    }
    const target = pickMonthWithTasks(filteredTasks, new Date());
    if (target) {
      setCurrentMonth(target);
    }
    didAutoJump.current = true;
  }, [tasks, filteredTasks, currentMonth]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const day of calendarDays) {
      const key = format(day, "yyyy-MM-dd");
      map.set(
        key,
        filteredTasks.filter((task) => taskAppearsOnDay(task, day)),
      );
    }
    return map;
  }, [filteredTasks, calendarDays]);

  const tasksInCurrentMonth = useMemo(
    () => monthHasTasks(filteredTasks, currentMonth),
    [filteredTasks, currentMonth],
  );

  const nearestMonthWithTasks = useMemo(
    () => pickMonthWithTasks(filteredTasks, currentMonth),
    [filteredTasks, currentMonth],
  );

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    return tasksByDay.get(format(selectedDay, "yyyy-MM-dd")) ?? [];
  }, [selectedDay, tasksByDay]);

  const openNewTask = (day?: Date) => {
    if (day) {
      const date = format(day, "yyyy-MM-dd");
      setNewTaskDefaults({ startDate: date, dueDate: date });
    } else {
      setNewTaskDefaults({});
    }
    setIsModalNewTaskOpen(true);
  };

  const closeNewTask = () => {
    setIsModalNewTaskOpen(false);
    setNewTaskDefaults({});
  };

  const openDayAgenda = (day: Date) => {
    setSelectedDay(day);
  };

  const filterLabel =
    assigneeFilter === "all"
      ? "Everyone"
      : assigneeFilter === "me"
        ? "Assigned to me"
        : assigneeFilter === "unassigned"
          ? "Unassigned"
          : users?.find((u) => u.userId === assigneeFilter)?.username || "User";

  return (
    <div className="p-8">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={closeNewTask}
        initialStartDate={newTaskDefaults.startDate}
        initialDueDate={newTaskDefaults.dueDate}
      />
      <ModalTaskDetails
        taskId={selectedTaskId}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Header name="Calendar" />
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            View tasks by assignee for each day. Click a day to open the schedule.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
            <span className="whitespace-nowrap">Show</span>
            <select
              className="flex h-9 w-auto min-w-[11rem] rounded-md border border-input bg-transparent px-3 text-sm"
              value={
                typeof assigneeFilter === "number"
                  ? String(assigneeFilter)
                  : assigneeFilter
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all" || value === "me" || value === "unassigned") {
                  setAssigneeFilter(value);
                  return;
                }
                setAssigneeFilter(Number(value));
              }}
            >
              <option value="all">Everyone</option>
              {myUserId != null && <option value="me">Assigned to me</option>}
              <option value="unassigned">Unassigned</option>
              {users?.map((user) =>
                user.userId != null ? (
                  <option key={user.userId} value={user.userId}>
                    {user.username}
                  </option>
                ) : null,
              )}
            </select>
          </label>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
          >
            Today
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            onClick={() => setCurrentMonth((m) => startOfMonth(subMonths(m, 1)))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="min-w-[10rem] text-center text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next month"
            onClick={() => setCurrentMonth((m) => startOfMonth(addMonths(m, 1)))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button type="button" onClick={() => openNewTask()}>
            Add New Task
          </Button>
        </div>
      </div>

      {/* Assignee legend when viewing everyone */}
      {assigneeFilter === "all" && users && users.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            People
          </span>
          {users
            .filter((u) => u.userId != null)
            .slice(0, 8)
            .map((user) => {
              const colors = colorForAssignee(user.userId);
              return (
                <button
                  key={user.userId}
                  type="button"
                  onClick={() => setAssigneeFilter(user.userId!)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition hover:opacity-90 ${colors.bg} ${colors.text}`}
                >
                  <AssigneeAvatar user={user} />
                  {user.username}
                </button>
              );
            })}
          <button
            type="button"
            onClick={() => setAssigneeFilter("unassigned")}
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${UNASSIGNED_COLOR.bg} ${UNASSIGNED_COLOR.text}`}
          >
            Unassigned
          </button>
        </div>
      )}

      {assigneeFilter !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-100">
            Showing: {filterLabel}
          </span>
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            onClick={() => setAssigneeFilter("all")}
          >
            Show everyone
          </button>
        </div>
      )}

      {!isLoading &&
        !isError &&
        filteredTasks.length > 0 &&
        !tasksInCurrentMonth &&
        nearestMonthWithTasks && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
            <span>
              No tasks with dates in {format(currentMonth, "MMMM yyyy")}.
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(nearestMonthWithTasks)}
            >
              Jump to {format(nearestMonthWithTasks, "MMMM yyyy")}
            </Button>
          </div>
        )}

      {!isLoading && !isError && filteredTasks.length === 0 && (
        <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-neutral-300">
          {tasks?.length
            ? `No tasks for ${filterLabel.toLowerCase()}. Try “Everyone” or another person.`
            : "No tasks yet. Click a day or Add New Task to create one."}
        </div>
      )}

      {isLoading && <p className="dark:text-white">Loading...</p>}
      {isError && (
        <p className="text-red-500">An error occurred while fetching tasks</p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-stroke-dark">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayTasks = tasksByDay.get(key) ?? [];
              const inMonth = isSameMonth(day, currentMonth);
              const visible = dayTasks.slice(0, MAX_VISIBLE_TASKS);
              const overflow = dayTasks.length - visible.length;
              const isSelected =
                selectedDay != null && isSameDay(selectedDay, day);

              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDayAgenda(day)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDayAgenda(day);
                    }
                  }}
                  className={`flex min-h-[7.5rem] cursor-pointer flex-col gap-1 border-b border-r border-gray-100 p-2 text-left transition hover:bg-gray-50 dark:border-stroke-dark dark:hover:bg-dark-tertiary/40 ${
                    !inMonth ? "bg-gray-50/80 dark:bg-dark-tertiary/20" : ""
                  } ${isSelected ? "ring-2 ring-inset ring-blue-500" : ""}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                        isToday(day)
                          ? "bg-blue-600 font-semibold text-white"
                          : inMonth
                            ? "text-gray-800 dark:text-white"
                            : "text-gray-400 dark:text-neutral-500"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-gray-400 dark:text-neutral-500">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-0.5">
                    {visible.map((task) => {
                      const colors = colorForAssignee(task.assignedUserId);
                      return (
                        <button
                          key={`${key}-${task.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskId(task.id);
                          }}
                          className={`flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-xs font-medium hover:opacity-90 ${colors.bg} ${colors.text}`}
                          title={`${task.title}${task.assignee?.username ? ` · ${task.assignee.username}` : " · Unassigned"}`}
                        >
                          <AssigneeAvatar user={task.assignee} />
                          <span className="truncate">{task.title}</span>
                        </button>
                      );
                    })}
                    {overflow > 0 && (
                      <span className="px-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Sheet
        open={selectedDay != null}
        onOpenChange={(open) => !open && setSelectedDay(null)}
      >
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-5 py-4 text-left">
            <SheetTitle>
              {selectedDay ? format(selectedDay, "EEEE, MMM d") : ""}
            </SheetTitle>
            <SheetDescription>
              {selectedDayTasks.length} task
              {selectedDayTasks.length === 1 ? "" : "s"}
              {assigneeFilter !== "all" ? ` · ${filterLabel}` : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="border-b px-5 py-3">
            <Button
              type="button"
              className="w-full"
              onClick={() => selectedDay && openNewTask(selectedDay)}
            >
              Add task on this day
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {selectedDayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tasks for {filterLabel.toLowerCase()} on this day.
              </p>
            ) : (
              <ul className="space-y-3">
                {selectedDayTasks.map((task) => {
                  const colors = colorForAssignee(task.assignedUserId);
                  return (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition hover:border-border ${colors.bg}`}
                      >
                        <span
                          className={`mt-1 h-8 w-1 shrink-0 rounded-full ${colors.chip}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium ${colors.text}`}>
                            {task.title}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <AssigneeAvatar user={task.assignee} size="md" />
                            <div className="min-w-0">
                              <p className="truncate text-sm">
                                {task.assignee?.username || "Unassigned"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {task.status || "No status"}
                                {task.dueDate
                                  ? ` · Due ${formatTaskDateLabel(task.dueDate)}`
                                  : task.startDate
                                    ? ` · Starts ${formatTaskDateLabel(task.startDate)}`
                                    : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarPage;
