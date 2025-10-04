import { NextResponse } from "next/server";
import { runTask, listTasks, stopTask, describeTasks } from "@/lib/awsEcs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cluster = url.searchParams.get("cluster") || process.env.AWS_ECS_CLUSTER!;
  const data = await listTasks(cluster);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { cluster, taskDefinition, subnets, count } = await req.json();
  const data = await runTask(cluster, taskDefinition, subnets, count);
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { cluster, taskArn, reason } = await req.json();
  const data = await stopTask(cluster, taskArn, reason);
  return NextResponse.json(data);
}
