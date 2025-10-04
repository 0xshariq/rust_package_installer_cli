import { Controller, Get, Post, Delete, Body } from "@nestjs/common";
import { AwsEcsService } from "./aws-ecs.service";

@Controller("aws-ecs")
export class AwsEcsController {
  constructor(private readonly svc: AwsEcsService) {}

  @Get("tasks")
  list(@Body("cluster") cluster: string) {
    return this.svc.listTasks(cluster);
  }

  @Post("run")
  run(@Body() body: { cluster: string; taskDefinition: string; subnets: string[]; count?: number }) {
    return this.svc.runTask(body.cluster, body.taskDefinition, body.subnets, body.count);
  }

  @Delete("stop")
  stop(@Body() body: { cluster: string; task: string; reason?: string }) {
    return this.svc.stopTask(body.cluster, body.task, body.reason);
  }
}
