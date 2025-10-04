import { Router } from "express";
import { createPaymentIntent, refundPayment } from "../controllers/stripeControllers";

const router = Router();

router.post("/order", createPaymentIntent);
router.post("/refund", refundPayment);

export default router;
