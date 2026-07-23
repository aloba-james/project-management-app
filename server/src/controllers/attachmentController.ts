import path from "path";
import fs from "fs";
import multer from "multer";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only image uploads are allowed"));
  },
});

export const createAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fileURL, fileName, taskId, uploadedById } = req.body;

  if (!fileURL || !taskId || !uploadedById) {
    res
      .status(400)
      .json({ message: "fileURL, taskId, and uploadedById are required" });
    return;
  }

  try {
    const attachment = await prisma.attachment.create({
      data: {
        fileURL,
        fileName: fileName || fileURL.split("/").pop() || "attachment",
        taskId: Number(taskId),
        uploadedById: Number(uploadedById),
      },
    });
    res.status(201).json(attachment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Creating Attachment: ${error.message}` });
  }
};

export const uploadAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId, uploadedById } = req.body;
  const file = req.file;

  if (!file || !taskId || !uploadedById) {
    res.status(400).json({
      message: "file, taskId, and uploadedById are required",
    });
    return;
  }

  try {
    const fileURL = `uploads/${file.filename}`;
    const attachment = await prisma.attachment.create({
      data: {
        fileURL,
        fileName: file.originalname,
        taskId: Number(taskId),
        uploadedById: Number(uploadedById),
      },
    });
    res.status(201).json(attachment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Uploading Attachment: ${error.message}` });
  }
};

export const deleteAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { attachmentId } = req.params;
  try {
    const existing = await prisma.attachment.findUnique({
      where: { id: Number(attachmentId) },
    });

    if (!existing) {
      res.status(404).json({ message: "Attachment not found" });
      return;
    }

    if (existing.fileURL.startsWith("uploads/")) {
      const filePath = path.join(process.cwd(), existing.fileURL);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.attachment.delete({
      where: { id: Number(attachmentId) },
    });
    res.json({ message: "Attachment deleted", id: Number(attachmentId) });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error Deleting Attachment: ${error.message}` });
  }
};
