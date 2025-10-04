import { Router } from "express";
import { getDistributions, addDistribution, removeDistribution } from "../controllers/awsCloudFrontController";

const router = Router();

router.get("/distributions", getDistributions);
router.post("/add", addDistribution);
router.delete("/delete", removeDistribution);

export default router;
