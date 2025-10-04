import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { AwsConfigService } from "./config.service";

@Controller("api/config")
export class AwsConfigController {
  constructor(private readonly svc: AwsConfigService) {}

  @Get()
  async handle(@Query("action") action: string, @Query("rule") rule?: string) {
    if (action === "rules") return this.svc.listConfigRules();
    if (action === "compliance" && rule) return this.svc.getComplianceDetails(rule);
    throw new BadRequestException("Invalid action");
  }
}
