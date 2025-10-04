
import { listAccounts, describeOrganization } from "../utils/aws-organizations.js";

export async function getAccounts(req, res) {
  try {
    const data = await listAccounts();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message ?? "Unknown error" });
  }
}

export async function getOrganization(req, res) {
  try {
    const data = await describeOrganization();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message ?? "Unknown error" });
  }
}
