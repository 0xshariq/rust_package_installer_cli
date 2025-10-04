import { Router } from "express";
import { addUser, getUsers, removeUser } from "../controllers/iamControllers";

const router = Router();

router.post("/add", addUser);
router.get("/users", getUsers);
router.delete("/delete", removeUser);

export default router;
