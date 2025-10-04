import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return NextResponse.json({ refund });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
