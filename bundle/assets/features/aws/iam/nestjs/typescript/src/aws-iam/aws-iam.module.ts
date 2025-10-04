import { Module } from "@nestjs/common";
import { AwsIamService } from "./aws-iam.service";
import { AwsIamController } from "./aws-iam.controller";

@Module({
  controllers: [AwsIamController],
  providers: [AwsIamService],
})
export class AwsIamModule {}
