import { Controller, Get } from "@nestjs/common";
import { AwsCloudTrailService } from "./cloudtrail.service";

@Controller("aws/cloudtrail")
export class AwsCloudTrailController {
  constructor(private readonly awsCloudTrailService: AwsCloudTrailService) {}

  @Get()
  async getTrails() {
    return this.awsCloudTrailService.describeTrails();
  }
}
