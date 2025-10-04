import { useFetcher } from "@remix-run/react";

export default function Checkout() {
  const fetcher = useFetcher();

  const handlePay = async () => {
    const res = await fetcher.submit({}, { method: "post", action: "/api/paypal.create-order" });
  };

  return (
    <div>
      <h1>PayPal Checkout</h1>
      <button onClick={handlePay}>Pay with PayPal</button>
    </div>
  );
}
