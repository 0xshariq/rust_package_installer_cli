import { Controller, Get, Post, Delete, Query, Body } from "@nestjs/common";
import { CodeCommitService } from "./codecommit.service";

@Controller("codecommit")
export class CodeCommitController {
  constructor(private readonly svc: CodeCommitService) {}
  @Get("repositories") list() { return this.svc.listRepositories(); }
  @Get("repository") get(@Query("repositoryName") name: string) { return this.svc.getRepository(name); }
  @Post("repository") create(@Body() body: { repositoryName: string; description?: string }) { return this.svc.createRepository(body.repositoryName, body.description); }
  @Delete("repository") remove(@Body("repositoryName") name: string) { return this.svc.deleteRepository(name); }
}
