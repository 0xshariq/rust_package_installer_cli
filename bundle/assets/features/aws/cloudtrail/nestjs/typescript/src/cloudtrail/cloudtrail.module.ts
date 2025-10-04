import { Module } from "@nestjs/common";
import { AwsCloudTrailService } from "./cloudtrail.service";
import { AwsCloudTrailController } from "./cloudtrail.controller";

@Module({
  controllers: [AwsCloudTrailController],
  providers: [AwsCloudTrailService],
})
export class AwsCloudTrailModule {}
