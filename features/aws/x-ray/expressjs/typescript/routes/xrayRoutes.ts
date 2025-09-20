import { Router } from "express";
import { putSegments, serviceGraph, summaries, groups, traceSummaries } from "../controllers/xrayController";

const router = Router();

router.post("/segments", putSegments);
router.get("/service-graph", serviceGraph);
router.get("/summaries", summaries);
router.get("/groups", groups);
router.get("/trace-summaries", traceSummaries);

export default router;
