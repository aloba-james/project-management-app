import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workspaceId =
      typeof req.query.workspaceId === "string"
        ? req.query.workspaceId
        : undefined;

    const projects = await prisma.project.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      include: {
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving Projects ${error.message}` });
  }
};

export const getProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: {
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving Project: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate, workspaceId } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        workspaceId: workspaceId || undefined,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Creating a Project: ${error.message}` });
  }
};

export const assignTeamToProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const { teamId } = req.body;

  if (!teamId) {
    res.status(400).json({ message: "teamId is required" });
    return;
  }

  try {
    const existing = await prisma.projectTeam.findFirst({
      where: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    if (existing) {
      res.status(409).json({ message: "Team already assigned to project" });
      return;
    }

    const projectTeam = await prisma.projectTeam.create({
      data: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
      include: {
        team: true,
      },
    });

    res.status(201).json(projectTeam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Assigning Team: ${error.message}` });
  }
};

export const removeTeamFromProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId, teamId } = req.params;

  try {
    const existing = await prisma.projectTeam.findFirst({
      where: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    if (!existing) {
      res.status(404).json({ message: "Project team assignment not found" });
      return;
    }

    await prisma.projectTeam.delete({
      where: { id: existing.id },
    });

    res.json({ message: "Team removed from project", id: existing.id });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Removing Team: ${error.message}` });
  }
};
