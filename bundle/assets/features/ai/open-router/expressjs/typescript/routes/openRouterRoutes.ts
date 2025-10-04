import express from "express";
import { handleMessage } from "../controllers/openrouterController";

const router = express.Router();
router.post("/handle", handleMessage);

export default router;
