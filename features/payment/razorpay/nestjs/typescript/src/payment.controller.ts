import { Controller, Post, Body } from "@nestjs/common";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

@Controller("payment")
export class PaymentController {
  @Post("order")
  async createOrder() {
    return razorpay.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "receipt#1",
    });
  }

  @Post("refund")
  async refund(@Body() body: { paymentId: string; amount: number }) {
    return razorpay.payments.refund(body.paymentId, { amount: body.amount });
  }
}
