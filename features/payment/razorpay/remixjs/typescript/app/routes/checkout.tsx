import { useEffect } from "react";

export default function Checkout() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    const res = await fetch("/api/order", { method: "POST" });
    const order = await res.json();

    const options: any = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: (response: any) =>
        alert("Payment success: " + response.razorpay_payment_id),
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return <button onClick={handlePay}>Pay</button>;
}
