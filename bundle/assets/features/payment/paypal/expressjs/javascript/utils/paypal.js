const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export async function createOrder(amount: string = "10.00") {
  const token = await generateAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: amount } }] }),
  });
  return res.json();
}

export async function captureOrder(orderID: string) {
  const token = await generateAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.json();
}

export async function refundPayment(captureID: string) {
  const token = await generateAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/payments/captures/${captureID}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.json();
}
