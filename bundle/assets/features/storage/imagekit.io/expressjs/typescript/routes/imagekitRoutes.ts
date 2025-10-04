import { Router } from "express";
import { upload, list, deletefile } from "../controllers/imagekitControllers";

const router = Router();

router.post("/upload", upload);
router.get("/list", list);
router.delete("/delete/:fileId", deletefile);

export default router;
