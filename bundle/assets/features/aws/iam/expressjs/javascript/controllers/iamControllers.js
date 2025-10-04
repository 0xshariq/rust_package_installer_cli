import { createUser, listUsers, deleteUser } from "../utils/awsIam.js";

export async function addUser(req, res) {
  try {
    const { username } = req.body;
    const data = await createUser(username);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const data = await listUsers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeUser(req, res) {
  try {
    const { username } = req.body;
    const data = await deleteUser(username);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
