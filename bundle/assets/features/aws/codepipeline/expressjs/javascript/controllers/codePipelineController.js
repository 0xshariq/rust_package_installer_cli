import { listPipelines, getPipeline, startPipelineExecution, getPipelineExecution } from "../utils/codePipeline.js";

export async function list(req, res) {
  try { res.json(await listPipelines()); } catch (e) { res.status(500).json({ error: e.message }); }
}

export async function get(req, res) {
  try { const { name } = req.query; res.json(await getPipeline(name)); } catch (e) { res.status(500).json({ error: e.message }); }
}

export async function getExecution(req, res) {
  try { const { pipelineName, executionId } = req.query; res.json(await getPipelineExecution(pipelineName, executionId)); } catch (e) { res.status(500).json({ error: e.message }); }
}

export async function start(req, res) {
  try { const { name } = req.body; res.json(await startPipelineExecution(name)); } catch (e) { res.status(500).json({ error: e.message }); }
}
