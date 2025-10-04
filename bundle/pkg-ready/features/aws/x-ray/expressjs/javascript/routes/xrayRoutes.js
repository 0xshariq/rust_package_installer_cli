import { Router } from "express";
import { putSegments, serviceGraph, summaries } from "../controllers/xrayController.js";

const router = Router();

router.post("/segments", putSegments);
router.get("/service-graph", serviceGraph);
router.get("/summaries", summaries);

export default router;
