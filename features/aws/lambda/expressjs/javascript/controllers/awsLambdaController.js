import { listFunctions, invokeFunction } from "../utils/awsLambda.js";

export async function getFunctions(_req, res) {
  try {
    const data = await listFunctions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function invoke(req, res) {
  try {
    const { functionName, payload, invocationType } = req.body;
    const data = await invokeFunction(functionName, payload, invocationType);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}