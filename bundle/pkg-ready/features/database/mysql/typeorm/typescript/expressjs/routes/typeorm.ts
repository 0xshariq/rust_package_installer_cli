import { Router } from "express";
import { getData } from "../controllers/typeormController"

const router = Router();

router.get("/", getData);

export default router;
