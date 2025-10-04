import { Request, Response } from "express";
import { listApplications, createDeployment, getDeployment, stopDeployment } from "../utils/codeDeploy";

export async function list(req: Request, res: Response) { try { res.json(await listApplications()); } catch (e) { res.status(500).json({ error: String(e) }); } }
export async function get(req: Request, res: Response) { try { const { deploymentId } = req.query as any; res.json(await getDeployment(deploymentId)); } catch (e) { res.status(500).json({ error: String(e) }); } }
export async function action(req: Request, res: Response) { try { const body = req.body; if (body.type === "create") return res.json(await createDeployment(body.params)); if (body.type === "stop") return res.json(await stopDeployment(body.deploymentId)); return res.status(400).json({ error: "invalid type" }); } catch (e) { res.status(500).json({ error: String(e) }); } }
