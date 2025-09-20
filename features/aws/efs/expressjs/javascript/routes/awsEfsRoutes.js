import { Router } from "express";
import { list, mounts, create, createMt, remove } from "../controllers/awsEfsController.js";

const router = Router();
router.get("/filesystems", list);
router.get("/mount-targets", mounts);
router.post("/create-fs", create);
router.post("/create-mt", createMt);
router.delete("/delete", remove);

export default router;
