import { ElasticLoadBalancingClient, CreateLoadBalancerCommand, DescribeLoadBalancersCommand, DeleteLoadBalancerCommand } from "@aws-sdk/client-elastic-load-balancing";

const client = new ElasticLoadBalancingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const createLoadBalancer = async (name: string, listeners: any[], subnets: string[]) => {
  const command = new CreateLoadBalancerCommand({ LoadBalancerName: name, Listeners: listeners, Subnets: subnets });
  return await client.send(command);
};

export const listLoadBalancers = async () => {
  const command = new DescribeLoadBalancersCommand({});
  return await client.send(command);
};

export const deleteLoadBalancer = async (name: string) => {
  const command = new DeleteLoadBalancerCommand({ LoadBalancerName: name });
  return await client.send(command);
};
