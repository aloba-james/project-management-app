import { Router } from "express";
import {
  assignTeamToProject,
  createProject,
  getProject,
  getProjects,
  removeTeamFromProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.get("/:projectId", getProject);
router.post("/", createProject);
router.post("/:projectId/teams", assignTeamToProject);
router.delete("/:projectId/teams/:teamId", removeTeamFromProject);

export default router;
