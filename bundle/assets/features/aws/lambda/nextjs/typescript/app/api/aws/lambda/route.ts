import { NextResponse } from "next/server";
import { listFunctions, invokeFunction } from "@/lib/awsLambda";

export async function GET() {
  const data = await listFunctions();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { functionName, payload, invocationType } = await req.json();
  const data = await invokeFunction(functionName, payload, invocationType);
  return NextResponse.json(data);
}
