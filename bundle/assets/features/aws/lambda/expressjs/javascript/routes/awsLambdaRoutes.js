import { Router } from "express";
import { getFunctions, invoke } from "../controllers/awsLambdaController.js";

const router = Router();
router.get("/functions", getFunctions);
router.post("/invoke", invoke);
export default router;
