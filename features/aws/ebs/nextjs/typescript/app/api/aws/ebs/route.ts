import { NextResponse } from "next/server";
import { listVolumes, createVolume, deleteVolume, attachVolume, detachVolume } from "@/lib/awsEbs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const az = url.searchParams.get("az") || undefined;
  const data = await listVolumes(az ? { "availability-zone": az } : undefined);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  switch (body.type) {
    case "create":
      return NextResponse.json(await createVolume(body.az, body.sizeGiB, body.volumeType, body.tagKey, body.tagValue));
    case "attach":
      return NextResponse.json(await attachVolume(body.volumeId, body.instanceId, body.device));
    case "detach":
      return NextResponse.json(await detachVolume(body.volumeId, body.instanceId, body.device, body.force));
    default:
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { volumeId } = await req.json();
  return NextResponse.json(await deleteVolume(volumeId));
}
