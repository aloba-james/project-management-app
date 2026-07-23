import { Router } from "express";
import { getUser, getUsers, upsertUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", upsertUser);
router.get("/:cognitoId", getUser);

export default router;
