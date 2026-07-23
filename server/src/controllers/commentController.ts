import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.query;
  try {
    const comments = await prisma.comment.findMany({
      where: taskId ? { taskId: Number(taskId) } : undefined,
      include: { user: true },
      orderBy: { id: "asc" },
    });
    res.json(comments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving Comments: ${error.message}` });
  }
};

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, taskId, userId } = req.body;

  if (!text || !taskId || !userId) {
    res.status(400).json({ message: "text, taskId, and userId are required" });
    return;
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId: Number(taskId),
        userId: Number(userId),
      },
      include: { user: true },
    });
    res.status(201).json(comment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Creating Comment: ${error.message}` });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    res.json({ message: "Comment deleted", id: Number(commentId) });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Deleting Comment: ${error.message}` });
  }
};
