import { NextResponse } from "next/server";
import { listApplications, createDeployment, getDeployment, stopDeployment } from "@/lib/codeDeploy";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("deploymentId");
  if (id) return NextResponse.json(await getDeployment(id));
  return NextResponse.json(await listApplications());
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "create") return NextResponse.json(await createDeployment(body.params));
  if (body.type === "stop") return NextResponse.json(await stopDeployment(body.deploymentId));
  return NextResponse.json({ error: "invalid type" }, { status: 400 });
}
