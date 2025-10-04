import { Request, Response } from "express";
import { listFunctions, invokeFunction } from "../utils/awsLambda";

export async function getFunctions(_req: Request, res: Response) {
  try {
    const data = await listFunctions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function invoke(req: Request, res: Response) {
  try {
    const { functionName, payload, invocationType } = req.body;
    const data = await invokeFunction(functionName, payload, invocationType);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
