
import express from "express";
import {upload, list, deletefile} from '../controllers/gcsControllers.js';

const router = express.Router();

const bucketName = process.env.GCP_BUCKET;

// Upload
router.post("/upload", upload);

// List
router.get("/list", list);

// Delete
router.delete("/delete", deletefile);

export default router;
