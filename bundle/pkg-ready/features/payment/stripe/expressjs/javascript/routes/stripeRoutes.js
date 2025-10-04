import { Router } from "express";
import { createPaymentIntent, refundPayment } from "../controllers/stripeControllers.js";

const router = Router();

router.post("/payment-intent", createPaymentIntent);
router.post("/refund", refundPayment);

export default router;
