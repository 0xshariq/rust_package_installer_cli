import { listVolumes, createVolume, deleteVolume, attachVolume, detachVolume } from "../utils/awsEbs.js";

export async function list(req, res) {
  try {
    const az = req.query.az || undefined;
    const data = await listVolumes(az ? { "availability-zone": az } : undefined);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function create(req, res) {
  try {
    const { az, sizeGiB, volumeType, tagKey, tagValue } = req.body;
    const data = await createVolume(az, sizeGiB, volumeType, tagKey, tagValue);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function remove(req, res) {
  try {
    const { volumeId } = req.body;
    const data = await deleteVolume(volumeId);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function attach(req, res) {
  try {
    const { volumeId, instanceId, device } = req.body;
    const data = await attachVolume(volumeId, instanceId, device);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}

export async function detach(req, res) {
  try {
    const { volumeId, instanceId, device, force } = req.body;
    const data = await detachVolume(volumeId, instanceId, device, force);
    res.json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
}
