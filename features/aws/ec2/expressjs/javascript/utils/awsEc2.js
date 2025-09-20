import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

const client = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function listInstances() {
  const command = new DescribeInstancesCommand({});
  return await client.send(command);
}

export async function startInstance(instanceId) {
  const command = new StartInstancesCommand({ InstanceIds: [instanceId] });
  return await client.send(command);
}

export async function stopInstance(instanceId) {
  const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
  return await client.send(command);
}

export async function terminateInstance(instanceId) {
  const command = new TerminateInstancesCommand({ InstanceIds: [instanceId] });
  return await client.send(command);
}
