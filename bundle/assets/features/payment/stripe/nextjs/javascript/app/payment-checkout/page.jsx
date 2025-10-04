"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutPage() {
  const [amount, setAmount] = useState(5000); // ₹50
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const createRes = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR" }),
    });
    const { clientSecret, paymentIntentId } = await createRes.json();

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const { error, paymentIntent } = await stripe.confirmPayment({
      clientSecret,
      // For demo: confirm without collecting payment details (test mode with a test method type)
      // In production, you should render Elements to collect card details.
      // This line below uses Stripe's "test" mode with automatic payment methods + default test PM.
      // Remove the following 'payment_method' in real apps and use Elements.
      payment_method: "pm_card_visa",
      redirect: "if_required",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("Payment successful! " + paymentIntent.id);
      // Example refund call:
      // await fetch("/api/stripe/refund", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentIntentId, amount: 2000 }) });
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Stripe Checkout</h1>
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <button onClick={pay} disabled={loading}>{loading ? "Processing..." : "Pay"}</button>
    </div>
  );
}
// Production tip: Replace the quick confirmPayment call with Stripe Elements to collect real card details. The refund API works the same either way.