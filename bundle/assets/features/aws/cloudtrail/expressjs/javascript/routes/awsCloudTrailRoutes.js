import express from "express";
import { getTrails } from "../controllers/awsCloudTrailController.js";

const router = express.Router();
router.get("/get", getTrails);

export default router;
