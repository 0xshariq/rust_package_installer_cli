import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const accessToken = await generateAccessToken();

  if (body.type === "create") {
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: "10.00" } }] }),
    });
    return json(await res.json());
  }

  if (body.type === "capture") {
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${body.orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    return json(await res.json());
  }

  if (body.type === "refund") {
    const res = await fetch(`${PAYPAL_API}/v2/payments/captures/${body.captureID}/refund`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    return json(await res.json());
  }

  return json({ error: "Invalid type" }, { status: 400 });
};
