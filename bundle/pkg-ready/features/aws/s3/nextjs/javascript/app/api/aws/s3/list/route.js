import { NextResponse } from "next/server";
import { listFiles } from "@/utils/s3";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get("prefix") || undefined;
    const files = await listFiles(prefix);
    return NextResponse.json(files);
  } catch (err) {
    return NextResponse.json({ error: "Failed to list files", details: err }, { status: 500 });
  }
}
