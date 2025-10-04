import { Controller, Get, Post, Delete, Body } from "@nestjs/common";
import { AwsCloudFrontService } from "./aws-cloudfront.service";

@Controller("aws-cloudfront")
export class AwsCloudFrontController {
  constructor(private readonly service: AwsCloudFrontService) {}

  @Get("distributions")
  list() {
    return this.service.listDistributions();
  }

  @Post("distribution")
  create(@Body("originDomain") originDomain: string) {
    return this.service.createDistribution(originDomain);
  }

  @Delete("distribution")
  remove(@Body() body: { id: string; etag: string }) {
    return this.service.deleteDistribution(body.id, body.etag);
  }
}
