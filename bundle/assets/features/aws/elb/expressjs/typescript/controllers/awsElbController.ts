import { Request, Response } from "express";
import { createLoadBalancer, listLoadBalancers, deleteLoadBalancer } from "../utils/awsElb";

export const getLoadBalancers = async (_req: Request, res: Response) => {
  try {
    const data = await listLoadBalancers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const addLoadBalancer = async (req: Request, res: Response) => {
  try {
    const { name, listeners, subnets } = req.body;
    const data = await createLoadBalancer(name, listeners, subnets);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const removeLoadBalancer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const data = await deleteLoadBalancer(name);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
