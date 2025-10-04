import { NextResponse } from "next/server";
import { createDistribution, listDistributions, deleteDistribution } from "@/lib/awsCloudFront.js";

export async function GET() {
  const data = await listDistributions();
  return NextResponse.json(data);
}

export async function POST(req) {
  const { originDomain } = await req.json();
  const data = await createDistribution(originDomain);
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const { id, etag } = await req.json();
  const data = await deleteDistribution(id, etag);
  return NextResponse.json(data);
}
