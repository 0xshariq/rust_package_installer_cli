import { listFileSystems, createFileSystem, deleteFileSystem, listMountTargets, createMountTarget, deleteMountTarget } from "../utils/awsEfs.js";

export async function list(req, res) {
  try { res.json(await listFileSystems()); }
  catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function mounts(req, res) {
  try {
    const { fileSystemId } = req.query;
    const data = await listMountTargets(fileSystemId);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function create(req, res) {
  try {
    const { performanceMode, encrypted, tags } = req.body;
    res.json(await createFileSystem(performanceMode, encrypted, tags));
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function createMt(req, res) {
  try {
    const { fileSystemId, subnetId, securityGroups } = req.body;
    res.json(await createMountTarget(fileSystemId, subnetId, securityGroups));
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function remove(req, res) {
  try {
    const { fileSystemId, mountTargetId } = req.body;
    if (mountTargetId) return res.json(await deleteMountTarget(mountTargetId));
    if (fileSystemId) return res.json(await deleteFileSystem(fileSystemId));
    res.status(400).json({ error: "missing identifier" });
  } catch (e) { res.status(500).json({ error: String(e) }); }
}
