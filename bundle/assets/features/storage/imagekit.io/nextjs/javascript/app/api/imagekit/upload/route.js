import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/imagekit";

export async function POST(request) {
  try {
    const { file, fileName, folder } = await request.json();
    const data = await uploadFile(file, fileName, folder);
    return NextResponse.json({ message: "Uploaded successfully", data });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed", details: err }, { status: 500 });
  }
}
