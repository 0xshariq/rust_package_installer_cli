import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { CodeDeployService } from "./codedeploy.service";

@Controller("codedeploy")
export class CodeDeployController {
  constructor(private readonly svc: CodeDeployService) {}

  @Get("applications")
  list() {
    return this.svc.listApplications();
  }

  @Get("deployment")
  get(@Query("deploymentId") deploymentId: string) {
    return this.svc.getDeployment(deploymentId);
  }

  @Post("deployment")
  create(@Body() body: any) {
    // body should include applicationName and other optional fields
    return this.svc.createDeployment(body);
  }

  @Post("deployment/stop")
  stop(@Body("deploymentId") deploymentId: string) {
    return this.svc.stopDeployment(deploymentId);
  }
}
