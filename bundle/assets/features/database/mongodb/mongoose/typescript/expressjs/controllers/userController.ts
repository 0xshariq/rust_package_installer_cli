import { Request, Response } from "express";
import { dbConnect } from "../utils/mongodb";
import User from "../models/User";

export async function getUsers(req: Request, res: Response) {
  await dbConnect();
  const users = await User.find({});
  res.json(users);
}
export async function getUserById(req: Request, res: Response) {
  await dbConnect();
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
}