import { NextResponse } from "next/server";
import { createLoadBalancer, listLoadBalancers, deleteLoadBalancer } from "@/lib/awsElb";

export async function GET() {
  const data = await listLoadBalancers();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name, listeners, subnets } = await req.json();
  const data = await createLoadBalancer(name, listeners, subnets);
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  const data = await deleteLoadBalancer(name);
  return NextResponse.json(data);
}
