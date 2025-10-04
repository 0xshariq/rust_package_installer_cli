import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/gcs";

export async function POST(req: Request) {
  try {
    const { key, base64 } = await req.json();
    const data = await uploadFile(key, base64);
    return NextResponse.json({ message: "Uploaded", data });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed", details: String(e) }, { status: 500 });
  }
}
