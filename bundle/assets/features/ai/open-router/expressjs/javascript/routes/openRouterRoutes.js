import express from "express";
import { handleMessage } from "../controllers/openrouterController.js";

const router = express.Router();
router.post("/handle", handleMessage);

export default router;
