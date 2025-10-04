
import { Router } from "express";
import { getAccounts, getOrganization } from "../controllers/organizationsController.js";

const router = Router();
router.get("/accounts", getAccounts);
router.get("/describe", getOrganization);
export default router;
