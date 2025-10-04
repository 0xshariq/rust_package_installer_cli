import { Controller, Get } from "@nestjs/common";
import { AwsTrustedAdvisorService } from "./aws-trustedadvisor.service";

@Controller("aws/trustedadvisor")
export class AwsTrustedAdvisorController {
  constructor(private readonly service: AwsTrustedAdvisorService) {}

  @Get()
  async getChecks() {
    return this.service.describeChecks();
  }
}
