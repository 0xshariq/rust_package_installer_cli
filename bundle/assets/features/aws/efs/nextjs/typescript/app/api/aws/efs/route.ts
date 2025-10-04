import { NextResponse } from "next/server";
import { listFileSystems, createFileSystem, deleteFileSystem, listMountTargets, createMountTarget, deleteMountTarget } from "@/lib/awsEfs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fsId = url.searchParams.get("fileSystemId");
  if (fsId) return NextResponse.json(await listMountTargets(fsId));
  return NextResponse.json(await listFileSystems());
}

export async function POST(req: Request) {
  const body = await req.json();
  switch (body.type) {
    case "create-fs":
      return NextResponse.json(await createFileSystem(body.performanceMode, body.encrypted, body.tags));
    case "create-mt":
      return NextResponse.json(await createMountTarget(body.fileSystemId, body.subnetId, body.securityGroups));
    default:
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  if (body.mountTargetId) return NextResponse.json(await deleteMountTarget(body.mountTargetId));
  if (body.fileSystemId) return NextResponse.json(await deleteFileSystem(body.fileSystemId));
  return NextResponse.json({ error: "missing identifier" }, { status: 400 });
}
