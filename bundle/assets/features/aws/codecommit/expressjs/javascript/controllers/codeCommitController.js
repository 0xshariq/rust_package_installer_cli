import {
  listRepositories,
  getRepository,
  createRepository,
  deleteRepository,
} from "../utils/codeCommit.js";

export async function list(req, res) {
  try {
    res.json(await listRepositories());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export async function get(req, res) {
  try {
    const { repositoryName } = req.query;
    res.json(await getRepository(repositoryName));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export async function create(req, res) {
  try {
    const { repositoryName, description } = req.body;
    res.json(await createRepository(repositoryName, description));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export async function remove(req, res) {
  try {
    const { repositoryName } = req.body;
    res.json(await deleteRepository(repositoryName));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
