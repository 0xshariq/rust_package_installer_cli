import { Router } from "express";
import { getUsers } from "../controllers/prismaController"

const router = Router();

router.get("/get", getUsers);

export default router;
