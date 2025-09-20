import { Router } from "express";
import { getFunctions, invoke } from "../controllers/awsLambdaController";

const router = Router();
router.get("/functions", getFunctions);
router.post("/invoke", invoke);
export default router;
