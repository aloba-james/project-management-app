import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.get("/user/:userId", getUserTasks);
router.get("/:taskId", getTask);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
