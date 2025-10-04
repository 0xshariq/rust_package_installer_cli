import { Router } from "express";
import { list, action } from "../controllers/codeBuildController";
const router = Router();
router.get("/projects", list);
router.post("/project", action);
export default router;
