import { Module } from "@nestjs/common";
import { AwsTrustedAdvisorService } from "./aws-trustedadvisor.service";
import { AwsTrustedAdvisorController } from "./aws-trustedadvisor.controller";

@Module({
  controllers: [AwsTrustedAdvisorController],
  providers: [AwsTrustedAdvisorService],
})
export class AwsTrustedAdvisorModule {}
