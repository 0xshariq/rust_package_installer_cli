import { Router } from "express";
import { list, get, action } from "../controllers/codeDeployController.js";

const router = Router();

router.get("/list", list);
router.get("/get", get);
router.post("/action", action);

export default router;
