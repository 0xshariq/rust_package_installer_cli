import { Request, Response } from "express";
import { createOrder, captureOrder, refundPayment } from "../utils/paypal.js";

export async function create(req: Request, res: Response) {
  const data = await createOrder(req.body.amount);
  res.json(data);
}

export async function capture(req: Request, res: Response) {
  const { orderID } = req.body;
  const data = await captureOrder(orderID);
  res.json(data);
}

export async function refund(req: Request, res: Response) {
  const { captureID } = req.body;
  const data = await refundPayment(captureID);
  res.json(data);
}
