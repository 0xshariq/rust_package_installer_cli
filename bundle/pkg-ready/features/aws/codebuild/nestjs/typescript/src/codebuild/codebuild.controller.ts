import { Controller, Get, Query } from "@nestjs/common";
import { CodeBuildService } from "./codebuild.service";

@Controller("codebuild")
export class CodeBuildController {
  constructor(private readonly codeBuildService: CodeBuildService) {}

  @Get("projects")
  async listProjects() {
    return this.codeBuildService.listProjects();
  }

  @Get("builds")
  async listBuilds(@Query("ids") ids: string[]) {
    return this.codeBuildService.listBuilds(ids);
  }
}
