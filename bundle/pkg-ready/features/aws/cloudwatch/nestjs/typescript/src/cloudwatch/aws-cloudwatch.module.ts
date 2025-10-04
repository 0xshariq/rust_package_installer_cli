import { Module } from "@nestjs/common";
import { AwsCloudWatchService } from "./aws-cloudwatch.service";
import { AwsCloudWatchController } from "./aws-cloudwatch.controller";

@Module({
  controllers: [AwsCloudWatchController],
  providers: [AwsCloudWatchService],
})
export class AwsCloudWatchModule {}
