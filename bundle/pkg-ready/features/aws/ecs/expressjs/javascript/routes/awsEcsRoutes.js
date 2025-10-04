import { Router } from "express";
import { list, run, stop } from "../controllers/awsEcsController.js";

const router = Router();
router.get("/tasks", list);
router.post("/run", run);
router.delete("/stop", stop);
export default router;
