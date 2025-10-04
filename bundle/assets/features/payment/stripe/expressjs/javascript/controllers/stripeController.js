import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/payment-intent
export async function createPaymentIntent(req, res) {
  try {
    const { amount, currency = "INR", metadata } = req.body;
    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: metadata || {},
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// POST /api/stripe/refund
export async function refundPayment(req, res) {
  try {
    const { paymentIntentId, amount } = req.body; // amount optional for full refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });
    res.json(refund);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
