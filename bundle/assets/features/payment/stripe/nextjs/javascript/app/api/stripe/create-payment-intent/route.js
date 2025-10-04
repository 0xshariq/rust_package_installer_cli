import Stripe from "stripe";

export async function POST(req) {
  try {
    const { amount, currency = "INR", metadata } = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,                 // e.g. 5000 => ₹50.00
      currency,               // e.g. "INR" or "USD"
      metadata: metadata || {},
      automatic_payment_methods: { enabled: true }, // generic checkout (cards + wallet where available)
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
