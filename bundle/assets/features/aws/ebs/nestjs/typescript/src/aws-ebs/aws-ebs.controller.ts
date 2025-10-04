import { Controller, Get, Post, Delete, Body, Query } from "@nestjs/common";
import { AwsEbsService } from "./aws-ebs.service";

@Controller("aws-ebs")
export class AwsEbsController {
  constructor(private readonly svc: AwsEbsService) {}

  @Get("volumes")
  list(@Query("az") az?: string) {
    return this.svc.list(az ? { "availability-zone": az } : undefined);
  }

  @Post()
  action(@Body() body: any) {
    switch (body.type) {
      case "create": return this.svc.create(body.az, body.sizeGiB, body.volumeType, body.tagKey, body.tagValue);
      case "attach": return this.svc.attach(body.volumeId, body.instanceId, body.device);
      case "detach": return this.svc.detach(body.volumeId, body.instanceId, body.device, body.force);
      default: return { error: "invalid type" };
    }
  }

  @Delete()
  remove(@Body("volumeId") volumeId: string) {
    return this.svc.delete(volumeId);
  }
}
