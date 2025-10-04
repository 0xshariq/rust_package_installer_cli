import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";

@Injectable()
export class PaypalService {
  private clientId = process.env.PAYPAL_CLIENT_ID!;
  private secret = process.env.PAYPAL_SECRET!;
  private api = "https://api-m.sandbox.paypal.com";

  private async generateAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString("base64");
    const res = await fetch(`${this.api}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const data = await res.json();
    return data.access_token;
  }

  async createOrder() {
    const token = await this.generateAccessToken();
    const res = await fetch(`${this.api}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: "10.00" } }] }),
    });
    return res.json();
  }

  async captureOrder(orderID: string) {
    const token = await this.generateAccessToken();
    const res = await fetch(`${this.api}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.json();
  }

  async refund(captureID: string) {
    const token = await this.generateAccessToken();
    const res = await fetch(`${this.api}/v2/payments/captures/${captureID}/refund`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.json();
  }
}
