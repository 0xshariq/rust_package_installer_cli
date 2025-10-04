import { Request, Response } from "express";
import { listFileSystems, createFileSystem, deleteFileSystem, listMountTargets, createMountTarget, deleteMountTarget } from "../utils/awsEfs";

export async function list(req: Request, res: Response) {
  try {
    const data = await listFileSystems();
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function mounts(req: Request, res: Response) {
  try {
    const { fileSystemId } = req.query as { fileSystemId: string };
    const data = await listMountTargets(fileSystemId);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function create(req: Request, res: Response) {
  try {
    const { performanceMode, encrypted, tags } = req.body;
    const data = await createFileSystem(performanceMode, encrypted, tags);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function createMt(req: Request, res: Response) {
  try {
    const { fileSystemId, subnetId, securityGroups } = req.body;
    const data = await createMountTarget(fileSystemId, subnetId, securityGroups);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function remove(req: Request, res: Response) {
  try {
    const { fileSystemId, mountTargetId } = req.body;
    if (mountTargetId) return res.json(await deleteMountTarget(mountTargetId));
    if (fileSystemId) return res.json(await deleteFileSystem(fileSystemId));
    res.status(400).json({ error: "missing identifier" });
  } catch (e) { res.status(500).json({ error: String(e) }); }
}
