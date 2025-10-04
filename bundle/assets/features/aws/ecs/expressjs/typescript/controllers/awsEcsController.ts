import { Request, Response } from "express";
import { runTask, listTasks, stopTask } from "../utils/awsEcs";

export async function list(req: Request, res: Response) {
  try {
    const cluster = (req.query.cluster as string) || process.env.AWS_ECS_CLUSTER!;
    const data = await listTasks(cluster);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function run(req: Request, res: Response) {
  try {
    const { cluster, taskDefinition, subnets, count } = req.body;
    const data = await runTask(cluster, taskDefinition, subnets, count);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function stop(req: Request, res: Response) {
  try {
    const { cluster, task, reason } = req.body;
    const data = await stopTask(cluster, task, reason);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
