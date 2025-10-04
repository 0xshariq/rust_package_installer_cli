import { ElasticLoadBalancingClient, CreateLoadBalancerCommand, DescribeLoadBalancersCommand, DeleteLoadBalancerCommand } from "@aws-sdk/client-elastic-load-balancing";

const client = new ElasticLoadBalancingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function createLoadBalancer(name, listeners, subnets) {
  const command = new CreateLoadBalancerCommand({ LoadBalancerName: name, Listeners: listeners, Subnets: subnets });
  return await client.send(command);
}

export async function listLoadBalancers() {
  const command = new DescribeLoadBalancersCommand({});
  return await client.send(command);
}

export async function deleteLoadBalancer(name) {
  const command = new DeleteLoadBalancerCommand({ LoadBalancerName: name });
  return await client.send(command);
}
