import type { Request, Response } from "express";
import { listConfigRules, getComplianceDetails } from "../utils/aws-config";

export async function getConfig(req: Request, res: Response) {
  const { action, rule } = req.query;

  try {
    if (action === "rules") {
      const data = await listConfigRules();
      return res.json({ ok: true, data });
    }
    if (action === "compliance" && typeof rule === "string") {
      const data = await getComplianceDetails(rule);
      return res.json({ ok: true, data });
    }
    return res.status(400).json({ ok: false, error: "Invalid action" });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
