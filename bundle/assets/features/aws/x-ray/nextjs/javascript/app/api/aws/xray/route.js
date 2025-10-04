import { NextResponse } from "next/server";
import { putTraceSegments, getServiceGraph, getTraceSummaries } from "@/lib/xray.js";

export async function POST(req) {
  const body = await req.json();
  if (body.type === "put") return NextResponse.json(await putTraceSegments(body.segments));
  return NextResponse.json({ error: "invalid type" }, { status: 400 });
}

export async function GET(req) {
  const url = new URL(req.url);
  const start = new Date(url.searchParams.get("start") || "");
  const end = new Date(url.searchParams.get("end") || "");
  const mode = url.searchParams.get("mode");
  if (mode === "serviceGraph") return NextResponse.json(await getServiceGraph(start, end));
  return NextResponse.json(await getTraceSummaries(start, end, url.searchParams.get("filter") || undefined));
}
