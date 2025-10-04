import { Router } from "express";
import { getConfig } from "../controllers/configController";

const router = Router();
router.get("/get", getConfig);
export default router;
