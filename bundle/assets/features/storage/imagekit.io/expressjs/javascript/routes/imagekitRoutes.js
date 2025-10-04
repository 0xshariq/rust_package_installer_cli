import { Router } from "express";
import { upload, list, deletefile } from "../controllers/imagekitControllers.js";

const router = Router();

router.post("/upload", upload);
router.get("/list", list);
router.delete("/delete", deletefile);

export default router;
