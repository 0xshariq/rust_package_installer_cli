import { Router } from "express";
import { list, get, start, getExecution } from "../controllers/codePipelineController.js";

const router = Router();
router.get("/pipelines", list);
router.get("/get", get);
router.get("/execution", getExecution);
router.post("/start", start);

export default router;
