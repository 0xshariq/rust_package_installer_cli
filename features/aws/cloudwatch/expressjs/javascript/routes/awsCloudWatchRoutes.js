import express from "express";
import { getAlarms } from "../controllers/awsCloudWatchController.js";

const router = express.Router();
router.get("/get", getAlarms);

export default router;
