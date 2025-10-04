import { Request, Response } from "express";
import { dbConnect } from "../utils/mongodb";
import User from "../models/User";

export async function getUsers(req: Request, res: Response) {
  await dbConnect();
  const users = await User.find({});
  res.json(users);
}