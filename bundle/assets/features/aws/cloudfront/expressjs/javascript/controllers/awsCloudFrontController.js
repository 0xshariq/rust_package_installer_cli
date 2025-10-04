import { createDistribution, listDistributions, deleteDistribution } from "../utils/awsCloudFront.js";

export async function getDistributions(req, res) {
  try {
    const data = await listDistributions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addDistribution(req, res) {
  try {
    const { originDomain } = req.body;
    const data = await createDistribution(originDomain);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeDistribution(req, res) {
  try {
    const { id, etag } = req.body;
    const data = await deleteDistribution(id, etag);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
