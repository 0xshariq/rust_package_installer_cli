import { runTask, listTasks, stopTask } from "../utils/awsEcs.js";

export async function list(req, res) {
  try {
    const cluster = req.query.cluster || process.env.AWS_ECS_CLUSTER;
    const data = await listTasks(cluster);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function run(req, res) {
  try {
    const { cluster, taskDefinition, subnets, count } = req.body;
    const data = await runTask(cluster, taskDefinition, subnets, count);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function stop(req, res) {
  try {
    const { cluster, task, reason } = req.body;
    const data = await stopTask(cluster, task, reason);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
