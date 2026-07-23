import { Router } from "express";
import {
  createAttachment,
  deleteAttachment,
  upload,
  uploadAttachment,
} from "../controllers/attachmentController";

const router = Router();

router.post("/", createAttachment);
router.post("/upload", upload.single("file"), uploadAttachment);
router.delete("/:attachmentId", deleteAttachment);

export default router;
