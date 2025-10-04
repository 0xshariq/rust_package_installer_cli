import { NextResponse } from "next/server";
import { signUpUser, signInUser, adminCreateUser, listUsers, adminDeleteUser } from "@/lib/awsCognito.js";

export async function POST(req) {
  const { type, payload } = await req.json();
  switch (type) {
    case "signup": return NextResponse.json(await signUpUser(payload.clientId, payload.username, payload.password, payload.email));
    case "signin": return NextResponse.json(await signInUser(payload.clientId, payload.username, payload.password));
    case "adminCreate": return NextResponse.json(await adminCreateUser(payload.userPoolId, payload.username, payload.temporaryPassword, payload.email));
    case "delete": return NextResponse.json(await adminDeleteUser(payload.userPoolId, payload.username));
    default: return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const userPoolId = url.searchParams.get("userPoolId");
  const data = await listUsers(userPoolId);
  return NextResponse.json(data);
}
