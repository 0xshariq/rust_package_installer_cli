import { NextResponse } from "next/server";
import { listFiles } from "@/lib/gcs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const prefix = url.searchParams.get("prefix") || "";
    const files = await listFiles(prefix);
    return NextResponse.json(files);
  } catch (e) {
    return NextResponse.json({ error: "List failed", details: String(e) }, { status: 500 });
  }
}
