import { Controller, Get, Post, Delete, Body } from "@nestjs/common";
import { AwsElbService } from "./aws-elb.service";

@Controller("aws-elb")
export class AwsElbController {
  constructor(private readonly service: AwsElbService) {}

  @Get("loadbalancers")
  list() {
    return this.service.listLoadBalancers();
  }

  @Post("loadbalancer")
  create(@Body() body: { name: string; listeners: any[]; subnets: string[] }) {
    return this.service.createLoadBalancer(body.name, body.listeners, body.subnets);
  }

  @Delete("loadbalancer")
  delete(@Body("name") name: string) {
    return this.service.deleteLoadBalancer(name);
  }
}
