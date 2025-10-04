import express from "express";
import { handleClaude } from "../controllers/claudeController";

const router = express.Router();
router.post("/handle", handleClaude);

export default router;
