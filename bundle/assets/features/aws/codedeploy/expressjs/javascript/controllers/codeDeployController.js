import { listApplications, createDeployment, getDeployment, stopDeployment } from "../utils/codeDeploy.js";

export async function list(req, res) {
  try {
    const data = await listApplications();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function get(req, res) {
  try {
    const { deploymentId } = req.query;
    const data = await getDeployment(deploymentId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function action(req, res) {
  try {
    const body = req.body;
    if (body.type === "create") {
      const data = await createDeployment(body.params);
      return res.json(data);
    }
    if (body.type === "stop") {
      const data = await stopDeployment(body.deploymentId);
      return res.json(data);
    }
    return res.status(400).json({ error: "invalid type" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
