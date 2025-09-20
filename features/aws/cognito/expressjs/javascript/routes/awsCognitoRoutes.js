import { Router } from "express";
import { action, list } from "../controllers/awsCognitoController.js";

const router = Router();
router.post("/", action);
router.get("/users", list);
export default router;
