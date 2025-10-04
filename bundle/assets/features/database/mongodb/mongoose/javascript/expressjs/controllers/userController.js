import { dbConnect } from "../utils/mongodb.js";
import User from "../models/User.js";

export async function getUsers(req, res) {
  await dbConnect();
  const { id } = req.body;
  const users = await User.find({ _id: id });
  res.json(users);
}
export async function getUserById(req, res) {
  await dbConnect();
  const { id } = req.body;
  const users = await User.find({ _id: id });
  res.json(users);
}
