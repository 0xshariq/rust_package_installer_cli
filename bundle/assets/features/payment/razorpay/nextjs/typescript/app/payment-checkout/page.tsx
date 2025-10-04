"use client";
import { useEffect } from "react";

export default function CheckoutPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const res = await fetch("/api/payment", { method: "POST" });
    const order = await res.json();

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Test Shop",
      description: "Test Transaction",
      order_id: order.id,
      handler: (response: any) => {
        alert("Payment successful: " + response.razorpay_payment_id);
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay with Razorpay</button>;
}
