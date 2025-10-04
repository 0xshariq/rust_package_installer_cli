import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const options = {
    amount: 50000, // amount in paise
    currency: "INR",
    receipt: "receipt#1",
  };

  const order = await razorpay.orders.create(options);
  return NextResponse.json(order);
}
