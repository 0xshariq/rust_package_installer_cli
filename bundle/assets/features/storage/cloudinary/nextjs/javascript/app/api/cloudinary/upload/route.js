import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const { file, folder } = await request.json();
    const data = await uploadFile(file, folder);
    return NextResponse.json({ message: "Uploaded successfully", data });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed", details: err }, { status: 500 });
  }
}
