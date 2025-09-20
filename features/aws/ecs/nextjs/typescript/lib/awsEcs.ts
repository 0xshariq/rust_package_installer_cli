import { ECSClient, RunTaskCommand, ListTasksCommand, StopTaskCommand, DescribeTasksCommand } from "@aws-sdk/client-ecs";

const client = new ECSClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  } : {})
});

export async function runTask(cluster: string, taskDefinition: string, subnets: string[], count = 1) {
  const cmd = new RunTaskCommand({
    cluster,
    taskDefinition,
    count,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: { subnets, assignPublicIp: "DISABLED" },
    },
  });
  return client.send(cmd);
}

export async function listTasks(cluster: string) {
  const cmd = new ListTasksCommand({ cluster });
  return client.send(cmd);
}

export async function stopTask(cluster: string, task: string, reason?: string) {
  const cmd = new StopTaskCommand({ cluster, task, reason });
  return client.send(cmd);
}

export async function describeTasks(cluster: string, tasks: string[]) {
  return client.send(new DescribeTasksCommand({ cluster, tasks }));
}
