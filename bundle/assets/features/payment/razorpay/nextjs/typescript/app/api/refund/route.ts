import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { paymentId, amount } = await req.json();

  const refund = await razorpay.payments.refund(paymentId, {
    amount, // optional, refund partial if less than full
  });

  return NextResponse.json(refund);
}
