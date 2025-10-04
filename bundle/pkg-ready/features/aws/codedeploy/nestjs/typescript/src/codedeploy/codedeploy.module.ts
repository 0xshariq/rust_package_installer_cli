import { Module } from "@nestjs/common";
import { CodeDeployService } from "./codedeploy.service";
import { CodeDeployController } from "./codedeploy.controller";

@Module({
  providers: [CodeDeployService],
  controllers: [CodeDeployController],
  exports: [CodeDeployService],
})
export class CodeDeployModule {}
