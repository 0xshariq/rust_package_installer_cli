import express from "express";
import { handleGrok } from "../controllers/grokController";

const router = express.Router();
router.post("/handle", handleGrok);

export default router;
