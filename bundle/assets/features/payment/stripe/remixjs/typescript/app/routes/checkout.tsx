import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { stripe } from "~/utils/stripe.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};
