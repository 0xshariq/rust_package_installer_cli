import { Request, Response } from "express";
import { putTraceSegments, getServiceGraph, getTraceSummaries, listGroups, listTraceSummaries } from "../utils/xray";

export async function putSegments(req: Request, res: Response) {
  try {
    const { segments } = req.body;
    const data = await putTraceSegments(segments);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function serviceGraph(req: Request, res: Response) {
  try {
    const { start, end } = req.query;
    const data = await getServiceGraph(new Date(start as string), new Date(end as string));
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function summaries(req: Request, res: Response) {
  try {
    const { start, end, filter } = req.query;
    const data = await getTraceSummaries(new Date(start as string), new Date(end as string), filter as string | undefined);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function groups(req: Request, res: Response) {
  try {
    const data = await listGroups();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function traceSummaries(req: Request, res: Response) {
  try {
    const { start, end, filter } = req.query;
    const data = await listTraceSummaries(new Date(start as string), new Date(end as string), filter as string | undefined);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
