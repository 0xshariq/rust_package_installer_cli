import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { dbConnect } from "../utils/mongodb";
import User from "../models/User";

export const loader: LoaderFunction = async () => {
  await dbConnect();
  const users = await User.find({});
  return json(users);
};
