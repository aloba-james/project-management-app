import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving Users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const cognitoId = String(req.params.cognitoId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving User: ${error.message}` });
  }
};

export const upsertUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, username, profilePictureUrl, teamId } = req.body;

  if (!cognitoId || !username) {
    res.status(400).json({ message: "cognitoId and username are required" });
    return;
  }

  try {
    const existingByOauth = await prisma.user.findUnique({
      where: { cognitoId },
    });

    if (existingByOauth) {
      const updated = await prisma.user.update({
        where: { cognitoId },
        data: {
          profilePictureUrl: profilePictureUrl ?? existingByOauth.profilePictureUrl,
          teamId: teamId ?? existingByOauth.teamId,
        },
      });
      res.json(updated);
      return;
    }

    let uniqueUsername = username;
    const usernameTaken = await prisma.user.findUnique({
      where: { username: uniqueUsername },
    });
    if (usernameTaken) {
      uniqueUsername = `${username}_${cognitoId.split(":").pop()?.slice(0, 6) || Date.now()}`;
    }

    const created = await prisma.user.create({
      data: {
        cognitoId,
        username: uniqueUsername,
        profilePictureUrl,
        teamId,
      },
    });

    res.status(201).json(created);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Upserting User: ${error.message}` });
  }
};
