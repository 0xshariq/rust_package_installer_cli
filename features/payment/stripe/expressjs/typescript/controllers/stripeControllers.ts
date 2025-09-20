import { Request, Response } from "express";
import { stripe } from "../utils/stripe";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res.json({ refund });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
