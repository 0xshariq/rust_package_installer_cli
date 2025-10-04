import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { stripe } from "~/utils/stripe.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { paymentIntentId } = await request.json();

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return json({ refund });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};
