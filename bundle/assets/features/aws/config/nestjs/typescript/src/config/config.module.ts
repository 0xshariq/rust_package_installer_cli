import { Module } from "@nestjs/common";
import { AwsConfigService } from "./config.service";
import { AwsConfigController } from "./config.controller";

@Module({
  providers: [AwsConfigService],
  controllers: [AwsConfigController],
})
export class AwsConfigModule {}
