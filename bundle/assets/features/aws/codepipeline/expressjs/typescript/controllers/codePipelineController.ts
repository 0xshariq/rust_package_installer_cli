import { Request, Response } from "express";
import { listPipelines, getPipeline, startPipelineExecution, getPipelineExecution } from "../utils/codePipeline";

export async function list(req: Request, res: Response) {
  try {
    res.json(await listPipelines());
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { name } = req.query as any;
    res.json(await getPipeline(name));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function getExecution(req: Request, res: Response) {
  try {
    const { pipelineName, executionId } = req.query as any;
    res.json(await getPipelineExecution(pipelineName, executionId));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function start(req: Request, res: Response) {
  try {
    const { name } = req.body;
    res.json(await startPipelineExecution(name));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
