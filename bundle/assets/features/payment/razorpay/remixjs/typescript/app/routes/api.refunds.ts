import type { ActionFunction } from "@remix-run/node";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const action: ActionFunction = async ({ request }) => {
  const { paymentId, amount } = await request.json();
  const refund = await razorpay.payments.refund(paymentId, { amount });
  return Response.json(refund);
};
