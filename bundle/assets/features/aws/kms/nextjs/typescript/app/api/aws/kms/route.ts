import { NextResponse } from "next/server";
import { encryptData, decryptData, listKeys } from "@/lib/awsKms";

export async function GET() {
  const data = await listKeys();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { keyId, plaintext } = await req.json();
  const data = await encryptData(keyId, plaintext);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const { ciphertext } = await req.json();
  const data = await decryptData(ciphertext);
  return NextResponse.json(data);
}
