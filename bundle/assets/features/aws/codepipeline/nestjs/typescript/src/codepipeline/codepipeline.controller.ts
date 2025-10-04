import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { CodePipelineService } from "./codepipeline.service";

@Controller("codepipeline")
export class CodePipelineController {
  constructor(private readonly svc: CodePipelineService) {}

  @Get("pipelines")
  list() {
    return this.svc.listPipelines();
  }

  @Get("pipeline")
  get(@Query("name") name: string) {
    return this.svc.getPipeline(name);
  }

  @Get("execution")
  getExecution(@Query("pipelineName") pipelineName: string, @Query("executionId") executionId: string) {
    return this.svc.getPipelineExecution(pipelineName, executionId);
  }

  @Post("start")
  start(@Body("name") name: string) {
    return this.svc.startPipelineExecution(name);
  }
}
