import { Router } from "express";
import { getLoadBalancers, addLoadBalancer, removeLoadBalancer } from "../controllers/awsElbController.js";

const router = Router();

router.get("/loadbalancers", getLoadBalancers);
router.post("/add", addLoadBalancer);
router.delete("/delete", removeLoadBalancer);

export default router;
