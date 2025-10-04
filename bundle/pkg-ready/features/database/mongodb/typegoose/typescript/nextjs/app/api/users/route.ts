import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}
