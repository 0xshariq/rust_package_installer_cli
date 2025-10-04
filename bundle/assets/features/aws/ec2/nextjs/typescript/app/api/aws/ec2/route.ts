import { NextResponse } from "next/server";
import { listInstances, startInstance, stopInstance, terminateInstance } from "@/lib/awsEc2";

export async function GET() {
  const data = await listInstances();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { instanceId, action } = await req.json();

  switch (action) {
    case "start":
      return NextResponse.json(await startInstance(instanceId));
    case "stop":
      return NextResponse.json(await stopInstance(instanceId));
    case "terminate":
      return NextResponse.json(await terminateInstance(instanceId));
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
