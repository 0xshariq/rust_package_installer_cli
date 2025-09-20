import { Injectable } from "@nestjs/common";
import { ElasticLoadBalancingClient, CreateLoadBalancerCommand, DescribeLoadBalancersCommand, DeleteLoadBalancerCommand } from "@aws-sdk/client-elastic-load-balancing";

@Injectable()
export class AwsElbService {
  private client = new ElasticLoadBalancingClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  listLoadBalancers() {
    return this.client.send(new DescribeLoadBalancersCommand({}));
  }

  createLoadBalancer(name: string, listeners: any[], subnets: string[]) {
    return this.client.send(new CreateLoadBalancerCommand({ LoadBalancerName: name, Listeners: listeners, Subnets: subnets }));
  }

  deleteLoadBalancer(name: string) {
    return this.client.send(new DeleteLoadBalancerCommand({ LoadBalancerName: name }));
  }
}
