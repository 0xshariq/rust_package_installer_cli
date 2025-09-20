import { Module } from "@nestjs/common";
import { CodePipelineService } from "./codepipeline.service";
import { CodePipelineController } from "./codepipeline.controller";

@Module({
  providers: [CodePipelineService],
  controllers: [CodePipelineController],
  exports: [CodePipelineService],
})
export class CodePipelineModule {}
