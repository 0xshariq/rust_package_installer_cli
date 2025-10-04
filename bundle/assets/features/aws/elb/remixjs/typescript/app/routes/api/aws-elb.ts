import { json } from "@remix-run/node";
import { ElasticLoadBalancingClient, CreateLoadBalancerCommand, DescribeLoadBalancersCommand, DeleteLoadBalancerCommand } from "@aws-sdk/client-elastic-load-balancing";

const client = new ElasticLoadBalancingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async () => {
  const command = new DescribeLoadBalancersCommand({});
  const data = await client.send(command);
  return json(data);
};

export const action = async ({ request }: any) => {
  const { name, listeners, subnets, type } = await request.json();

  let command;
  switch (type) {
    case "create":
      command = new CreateLoadBalancerCommand({ LoadBalancerName: name, Listeners: listeners, Subnets: subnets });
      break;
    case "delete":
      command = new DeleteLoadBalancerCommand({ LoadBalancerName: name });
      break;
    default:
      return json({ error: "Invalid type" }, { status: 400 });
  }

  const data = await client.send(command);
  return json(data);
};
