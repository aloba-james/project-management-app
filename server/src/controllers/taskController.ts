import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const taskInclude = {
  author: true,
  assignee: true,
  comments: {
    include: { user: true },
    orderBy: { id: "asc" as const },
  },
  attachments: true,
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: projectId
        ? {
            projectId: Number(projectId),
          }
        : undefined,
      include: taskInclude,
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving Tasks ${error.message}` });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: taskInclude,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: `Error Retrieving Task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: taskInclude,
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving User Tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
      include: taskInclude,
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Creating a Task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
      include: taskInclude,
    });
    res.json(updatedTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Updating Task ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
  } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(tags !== undefined && { tags }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(points !== undefined && { points: points === "" ? null : points }),
        ...(assignedUserId !== undefined && {
          assignedUserId: assignedUserId ? Number(assignedUserId) : null,
        }),
      },
      include: taskInclude,
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error Updating Task: ${error.message}` });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const id = Number(taskId);

  try {
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { taskId: id } }),
      prisma.attachment.deleteMany({ where: { taskId: id } }),
      prisma.taskAssignment.deleteMany({ where: { taskId: id } }),
      prisma.task.delete({ where: { id } }),
    ]);

    res.json({ message: "Task deleted successfully", id });
  } catch (error: any) {
    res.status(500).json({ message: `Error Deleting Task: ${error.message}` });
  }
};
