import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { Id } = await request.json();
  const users = await User.find({ _id: Id });
  return NextResponse.json(users);
}
