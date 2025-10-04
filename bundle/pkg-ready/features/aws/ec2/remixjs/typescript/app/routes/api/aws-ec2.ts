import { json } from "@remix-run/node";
import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

const client = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async () => {
  const command = new DescribeInstancesCommand({});
  const data = await client.send(command);
  return json(data);
};

export const action = async ({ request }: any) => {
  const { instanceId, action } = await request.json();

  let command;
  switch (action) {
    case "start":
      command = new StartInstancesCommand({ InstanceIds: [instanceId] });
      break;
    case "stop":
      command = new StopInstancesCommand({ InstanceIds: [instanceId] });
      break;
    case "terminate":
      command = new TerminateInstancesCommand({ InstanceIds: [instanceId] });
      break;
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }

  const data = await client.send(command);
  return json(data);
};
