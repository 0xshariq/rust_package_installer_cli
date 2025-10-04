import { Router } from "express";
import { upload, list } from "../controllers/s3Controllers.js";

const router = Router();

router.post("/upload", upload);
router.get("/list", list);

export default router;
