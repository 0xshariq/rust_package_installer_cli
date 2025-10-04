import { listInstances, startInstance, stopInstance, terminateInstance } from "../utils/awsEc2.js";

export async function getInstances(req, res) {
  try {
    const data = await listInstances();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function manageInstance(req, res) {
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
    res.status(500).json({ error: err.message });
  }
}
