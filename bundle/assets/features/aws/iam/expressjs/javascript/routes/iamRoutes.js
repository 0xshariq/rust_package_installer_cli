import { Router } from "express";
import { addUser, getUsers, removeUser } from "../controllers/iamControllers.js";

const router = Router();

router.post("/add", addUser);
router.get("/users", getUsers);
router.delete("/delete", removeUser);

export default router;
