import { Injectable } from "@nestjs/common";
import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

@Injectable()
export class AwsEc2Service {
  private client = new EC2Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  listInstances() {
    return this.client.send(new DescribeInstancesCommand({}));
  }

  startInstance(instanceId: string) {
    return this.client.send(new StartInstancesCommand({ InstanceIds: [instanceId] }));
  }

  stopInstance(instanceId: string) {
    return this.client.send(new StopInstancesCommand({ InstanceIds: [instanceId] }));
  }

  terminateInstance(instanceId: string) {
    return this.client.send(new TerminateInstancesCommand({ InstanceIds: [instanceId] }));
  }
}
