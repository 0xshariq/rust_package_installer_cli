import { Request, Response } from "express";
import { listProjects, startBuild, batchGetBuilds, stopBuild } from "../utils/codeBuild";

export async function list(req: Request, res: Response) { try { res.json(await listProjects()); } catch (e) { res.status(500).json({ error: String(e) }); } }
export async function action(req: Request, res: Response) {
  try {
    const body = req.body;
    if (body.type === "start") return res.json(await startBuild(body.projectName, body.override));
    if (body.type === "batchGet") return res.json(await batchGetBuilds(body.ids));
    if (body.type === "stop") return res.json(await stopBuild(body.id, body.reason));
    return res.status(400).json({ error: "invalid type" });
  } catch (e) { res.status(500).json({ error: String(e) }); }
}
