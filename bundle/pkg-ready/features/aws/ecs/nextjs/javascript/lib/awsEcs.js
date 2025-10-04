import { ECSClient, RunTaskCommand, ListTasksCommand, StopTaskCommand, DescribeTasksCommand } from "@aws-sdk/client-ecs";

const client = new ECSClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {})
});

export function runTask(cluster, taskDefinition, subnets, count = 1) {
  return client.send(new RunTaskCommand({
    cluster, taskDefinition, count, launchType: "FARGATE",
    networkConfiguration: { awsvpcConfiguration: { subnets, assignPublicIp: "DISABLED" } },
  }));
}

export function listTasks(cluster) {
  return client.send(new ListTasksCommand({ cluster }));
}

export function stopTask(cluster, task, reason) {
  return client.send(new StopTaskCommand({ cluster, task, reason }));
}

export function describeTasks(cluster, tasks) {
  return client.send(new DescribeTasksCommand({ cluster, tasks }));
}
