import { createLoadBalancer, listLoadBalancers, deleteLoadBalancer } from "../utils/awsElb.js";

export async function getLoadBalancers(req, res) {
  try {
    const data = await listLoadBalancers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addLoadBalancer(req, res) {
  try {
    const { name, listeners, subnets } = req.body;
    const data = await createLoadBalancer(name, listeners, subnets);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeLoadBalancer(req, res) {
  try {
    const { name } = req.body;
    const data = await deleteLoadBalancer(name);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
