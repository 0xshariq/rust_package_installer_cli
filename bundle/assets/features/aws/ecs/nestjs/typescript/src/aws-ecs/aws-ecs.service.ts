import { Injectable } from "@nestjs/common";
import { ECSClient, RunTaskCommand, ListTasksCommand, StopTaskCommand, DescribeTasksCommand } from "@aws-sdk/client-ecs";

@Injectable()
export class AwsEcsService {
  private client = new ECSClient({
    region: process.env.AWS_REGION,
    ...(process.env.AWS_ACCESS_KEY_ID ? {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    } : {})
  });

  runTask(cluster: string, taskDefinition: string, subnets: string[], count = 1) {
    return this.client.send(new RunTaskCommand({
      cluster, taskDefinition, count, launchType: "FARGATE",
      networkConfiguration: { awsvpcConfiguration: { subnets, assignPublicIp: "DISABLED" } },
    }));
  }

  listTasks(cluster: string) {
    return this.client.send(new ListTasksCommand({ cluster }));
  }

  stopTask(cluster: string, task: string, reason?: string) {
    return this.client.send(new StopTaskCommand({ cluster, task, reason }));
  }

  describeTasks(cluster: string, tasks: string[]) {
    return this.client.send(new DescribeTasksCommand({ cluster, tasks }));
  }
}
