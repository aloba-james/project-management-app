import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/commentController";

const router = Router();

router.get("/", getComments);
router.post("/", createComment);
router.delete("/:commentId", deleteComment);

export default router;
