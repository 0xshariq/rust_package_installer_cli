import { Router } from "express";
import { getInstances, manageInstance } from "../controllers/awsEc2Controller.js";

const router = Router();

router.get("/instances", getInstances);
router.post("/manage", manageInstance);

export default router;
