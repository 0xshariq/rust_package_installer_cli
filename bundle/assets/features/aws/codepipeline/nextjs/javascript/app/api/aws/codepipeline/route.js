import { NextResponse } from "next/server";
import { listPipelines, getPipeline, startPipelineExecution, getPipelineExecution } from "@/lib/codePipeline.js";

export async function GET(req) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const execId = url.searchParams.get("executionId");
  if (name && execId) return NextResponse.json(await getPipelineExecution(name, execId));
  if (name) return NextResponse.json(await getPipeline(name));
  return NextResponse.json(await listPipelines());
}

export async function POST(req) {
  const body = await req.json();
  if (body.type === "start") return NextResponse.json(await startPipelineExecution(body.name));
  return NextResponse.json({ error: "invalid type" }, { status: 400 });
}
