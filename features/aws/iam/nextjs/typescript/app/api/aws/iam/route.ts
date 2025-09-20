import { NextResponse } from "next/server";
import { createUser, listUsers, deleteUser } from "@/lib/awsIam";

export async function POST(req: Request) {
  const { username } = await req.json();
  const data = await createUser(username);
  return NextResponse.json(data);
}

export async function GET() {
  const data = await listUsers();
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { username } = await req.json();
  const data = await deleteUser(username);
  return NextResponse.json(data);
}
