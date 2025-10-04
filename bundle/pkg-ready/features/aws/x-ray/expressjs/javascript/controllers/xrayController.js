import { putTraceSegments, getServiceGraph, getTraceSummaries } from "../utils/xray.js";

export async function putSegments(req, res) {
  try {
    const { segments } = req.body;
    const data = await putTraceSegments(segments);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function serviceGraph(req, res) {
  try {
    const { start, end } = req.query;
    const data = await getServiceGraph(new Date(start), new Date(end));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function summaries(req, res) {
  try {
    const { start, end, filter } = req.query;
    const data = await getTraceSummaries(new Date(start), new Date(end), filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
