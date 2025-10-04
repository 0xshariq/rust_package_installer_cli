import { NextResponse } from "next/server";
import { listFiles } from "@/lib/imagekit";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "/";
    const files = await listFiles(path);
    return NextResponse.json(files);
  } catch (err) {
    return NextResponse.json({ error: "Failed to list files", details: err }, { status: 500 });
  }
}
