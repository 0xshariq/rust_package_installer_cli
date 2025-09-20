import express from "express";
import { getAlarms } from "../controllers/awsCloudWatchController";

const router = express.Router();
router.get("/get", getAlarms);

export default router;
