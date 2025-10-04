import { Router } from "express";
import { getKeys, encrypt, decrypt } from "../controllers/awsKmsController.js";

const router = Router();

router.get("/keys", getKeys);
router.post("/encrypt", encrypt);
router.put("/decrypt", decrypt);

export default router;
