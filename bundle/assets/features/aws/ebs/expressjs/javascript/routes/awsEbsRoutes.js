import { Router } from "express";
import { list, create, remove, attach, detach } from "../controllers/awsEbsController.js";

const router = Router();
router.get("/volumes", list);
router.post("/create", create);
router.delete("/delete", remove);
router.post("/attach", attach);
router.post("/detach", detach);

export default router;
