    import { NextResponse } from "next/server";
import { createDistribution, listDistributions, deleteDistribution, getDistribution } from "@/lib/awsCloudFront";

export async function GET() {
  const data = await listDistributions();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { originDomain } = await req.json();
  const data = await createDistribution(originDomain);
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { id, etag } = await req.json();
  const data = await deleteDistribution(id, etag);
  return NextResponse.json(data);
}
