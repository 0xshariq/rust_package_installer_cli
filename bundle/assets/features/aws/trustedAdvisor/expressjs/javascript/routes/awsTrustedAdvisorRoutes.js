import express from "express";
import { getChecks } from "../controllers/awsTrustedAdvisorController.js";

const router = express.Router();
router.get("/get", getChecks);

export default router;
