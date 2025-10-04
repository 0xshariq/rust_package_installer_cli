import { Request, Response } from "express";
import { createUser, listUsers, deleteUser } from "../utils/awsIam";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const data = await createUser(username);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const data = await listUsers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const data = await deleteUser(username);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
