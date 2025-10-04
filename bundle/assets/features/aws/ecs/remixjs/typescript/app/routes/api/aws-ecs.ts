import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { runTask, listTasks, stopTask } from "../../utils/awsEcs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const cluster = url.searchParams.get("cluster") || process.env.AWS_ECS_CLUSTER!;
  const data = await listTasks(cluster);
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  if (body.type === "run") {
    const data = await runTask(body.cluster, body.taskDefinition, body.subnets, body.count);
    return json(data);
  } else if (body.type === "stop") {
    const data = await stopTask(body.cluster, body.task, body.reason);
    return json(data);
  }
  return json({ error: "invalid type" }, { status: 400 });
};
