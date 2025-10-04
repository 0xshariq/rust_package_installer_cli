import { Router } from "express";
import Razorpay from "razorpay";
import { createOrder, refundPayment } from "../../controllers/payment";

const router = Router();

// Create order
router.post("/order", createOrder);

// Refund
router.post("/refund", refundPayment);

export default router;