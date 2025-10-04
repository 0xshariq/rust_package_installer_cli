import { Controller, Get } from "@nestjs/common";
import { AwsCloudWatchService } from "./aws-cloudwatch.service";

@Controller("aws/cloudwatch")
export class AwsCloudWatchController {
  constructor(private readonly awsCloudWatchService: AwsCloudWatchService) {}

  @Get()
  async getAlarms() {
    return this.awsCloudWatchService.describeAlarms();
  }
}
