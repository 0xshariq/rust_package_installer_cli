import { NextResponse } from "next/server";
import { listProjects, startBuild, batchGetBuilds, stopBuild } from "@/lib/codeBuild";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const project = url.searchParams.get("project");
  if (project) return NextResponse.json(await listProjects());
  return NextResponse.json(await listProjects());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "start") return NextResponse.json(await startBuild(body.projectName, body.override));
  if (body.type === "batchGet") return NextResponse.json(await batchGetBuilds(body.ids));
  if (body.type === "stop") return NextResponse.json(await stopBuild(body.id, body.reason));
  return NextResponse.json({ error: "invalid type" }, { status: 400 });
}
