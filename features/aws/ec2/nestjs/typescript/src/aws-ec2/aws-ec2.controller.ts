import { Controller, Get, Post, Body } from "@nestjs/common";
import { AwsEc2Service } from "./aws-ec2.service";

@Controller("aws-ec2")
export class AwsEc2Controller {
  constructor(private readonly service: AwsEc2Service) {}

  @Get("instances")
  list() {
    return this.service.listInstances();
  }

  @Post("instance")
  manage(@Body() body: { instanceId: string; action: string }) {
    const { instanceId, action } = body;
    switch (action) {
      case "start":
        return this.service.startInstance(instanceId);
      case "stop":
        return this.service.stopInstance(instanceId);
      case "terminate":
        return this.service.terminateInstance(instanceId);
      default:
        return { error: "Invalid action" };
    }
  }
}
