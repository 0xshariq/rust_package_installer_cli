import { Router } from "express";
import { list, get, create, remove } from "../controllers/codeCommitController";

const router = Router();
router.get("/repositories", list);
router.get("/repository", get);
router.post("/create-repo", create);
router.delete("/remove-repo", remove);

export default router;
