import { useState } from "react";

export default function CheckoutPage() {
  const [orderID, setOrderID] = useState("");

  const createOrder = async () => {
    const res = await fetch("/api/paypal/create-payment", { method: "POST" });
    const data = await res.json();
    setOrderID(data.id);
  };

  const captureOrder = async () => {
    const res = await fetch("/api/paypal/capture-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID }),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div>
      <h1>PayPal Checkout</h1>
      <button onClick={createOrder}>Create Order</button>
      {orderID && <button onClick={captureOrder}>Capture Payment</button>}
    </div>
  );
}
