import { NextResponse } from "next/server";
import { uploadFile } from "@/utils/s3";

export async function POST(request) {
  try {
    const { key, content } = await request.json();
    const data = await uploadFile(key, content);
    return NextResponse.json({ message: "File uploaded", data });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed", details: err }, { status: 500 });
  }
}
