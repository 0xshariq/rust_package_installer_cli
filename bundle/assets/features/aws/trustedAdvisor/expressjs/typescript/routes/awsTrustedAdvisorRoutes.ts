import express from "express";
import { getChecks } from "../controllers/awsTrustedAdvisorController";

const router = express.Router();
router.get("/get", getChecks);

export default router;
