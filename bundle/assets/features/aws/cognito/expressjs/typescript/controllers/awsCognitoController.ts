import { Request, Response } from "express";
import { signUpUser, signInUser, adminCreateUser, listUsers, adminDeleteUser } from "../utils/awsCognito";

export async function action(req: Request, res: Response) {
  try {
    const { type, payload } = req.body;
    switch (type) {
      case "signup": return res.json(await signUpUser(payload.clientId, payload.username, payload.password, payload.email));
      case "signin": return res.json(await signInUser(payload.clientId, payload.username, payload.password));
      case "adminCreate": return res.json(await adminCreateUser(payload.userPoolId, payload.username, payload.temporaryPassword, payload.email));
      case "delete": return res.json(await adminDeleteUser(payload.userPoolId, payload.username));
      default: return res.status(400).json({ error: "invalid type" });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const userPoolId = req.query.userPoolId as string;
    const data = await listUsers(userPoolId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
