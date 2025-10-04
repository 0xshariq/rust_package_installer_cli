import Stripe from "stripe";

export async function POST(req) {
  try {
    const { paymentIntentId, amount } = await req.json(); // amount optional for full refund
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount, // omit for full refund; pass to do partial
    });

    return new Response(JSON.stringify(refund), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
