import { Router } from "express";
import { upload, list, remove } from "../controllers/gcsControllers";

const router = Router();

router.post("/upload", upload);
router.get("/list", list);
router.post("/delete", remove);

export default router;
