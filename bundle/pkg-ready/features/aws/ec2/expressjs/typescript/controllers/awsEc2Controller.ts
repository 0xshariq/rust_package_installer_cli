import { Request, Response } from "express";
import { listInstances, startInstance, stopInstance, terminateInstance } from "../utils/awsEc2";

export const getInstances = async (_req: Request, res: Response) => {
  try {
    const data = await listInstances();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const manageInstance = async (req: Request, res: Response) => {
  try {
    const { instanceId, action } = req.body;
    let data;

    switch (action) {
      case "start":
        data = await startInstance(instanceId);
        break;
      case "stop":
        data = await stopInstance(instanceId);
        break;
      case "terminate":
        data = await terminateInstance(instanceId);
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
