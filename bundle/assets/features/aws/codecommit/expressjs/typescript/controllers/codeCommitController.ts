import { Request, Response } from "express";
import { listRepositories, getRepository, createRepository, deleteRepository } from "../utils/codeCommit";

export async function list(req: Request, res: Response) {
  try { res.json(await listRepositories()); } catch (e) { res.status(500).json({ error: String(e) }); }
}
export async function get(req: Request, res: Response) {
  try { const { repositoryName } = req.query as any; res.json(await getRepository(repositoryName)); } catch (e) { res.status(500).json({ error: String(e) }); }
}
export async function create(req: Request, res: Response) {
  try { const { repositoryName, description } = req.body; res.json(await createRepository(repositoryName, description)); } catch (e) { res.status(500).json({ error: String(e) }); }
}
export async function remove(req: Request, res: Response) {
  try { const { repositoryName } = req.body; res.json(await deleteRepository(repositoryName)); } catch (e) { res.status(500).json({ error: String(e) }); }
}
