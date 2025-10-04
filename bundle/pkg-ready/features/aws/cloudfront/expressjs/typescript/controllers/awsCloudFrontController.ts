import { Request, Response } from "express";
import { createDistribution, listDistributions, deleteDistribution } from "../utils/awsCloudFront";

export const getDistributions = async (_req: Request, res: Response) => {
  try {
    const data = await listDistributions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const addDistribution = async (req: Request, res: Response) => {
  try {
    const { originDomain } = req.body;
    const data = await createDistribution(originDomain);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const removeDistribution = async (req: Request, res: Response) => {
  try {
    const { id, etag } = req.body;
    const data = await deleteDistribution(id, etag);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
