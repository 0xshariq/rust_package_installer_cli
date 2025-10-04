import type { ActionFunction } from "@remix-run/node";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const action: ActionFunction = async () => {
  const order = await razorpay.orders.create({
    amount: 50000,
    currency: "INR",
    receipt: "receipt#1",
  });
  return Response.json(order);
};
