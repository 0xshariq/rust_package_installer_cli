import express from "express";
import { handleClaude } from "../controllers/claudeController.js";

const router = express.Router();
router.post("/handle", handleClaude);

export default router;
