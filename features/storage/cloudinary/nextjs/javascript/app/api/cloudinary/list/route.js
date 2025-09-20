import { NextResponse } from "next/server";
import { listFiles } from "@/lib/cloudinary";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get("prefix") || "";
    const files = await listFiles(prefix);
    return NextResponse.json(files);
  } catch (err) {
    return NextResponse.json({ error: "List failed", details: err }, { status: 500 });
  }
}
