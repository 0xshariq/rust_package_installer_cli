// controllers/organizations.controller.ts
import type { Request, Response } from "express";
import { listAccounts, describeOrganization } from "../utils/aws-organizations.js";

export async function getAccounts(req: Request, res: Response) {
  try {
    const data = await listAccounts();
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message ?? "Unknown error" });
  }
}

export async function getOrganization(req: Request, res: Response) {
  try {
    const data = await describeOrganization();
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message ?? "Unknown error" });
  }
}
