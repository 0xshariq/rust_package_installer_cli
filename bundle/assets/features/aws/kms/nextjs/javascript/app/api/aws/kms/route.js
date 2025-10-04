import { NextResponse } from "next/server";
import { encryptData, decryptData, listKeys } from "@/lib/awsKms.js";

export async function GET() {
  const data = await listKeys();
  return NextResponse.json(data);
}

export async function POST(req) {
  const { keyId, plaintext } = await req.json();
  const data = await encryptData(keyId, plaintext);
  return NextResponse.json(data);
}

export async function PUT(req) {
  const { ciphertext } = await req.json();
  const data = await decryptData(ciphertext);
  return NextResponse.json(data);
}
