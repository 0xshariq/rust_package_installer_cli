import { Router } from "express";
import Razorpay from "razorpay";
import { createOrder, refundPayment } from "../controllers/payment";

const router = Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create order
router.post("/order", createOrder);

// Refund
router.post("/refund", refundPayment);

export default router;
