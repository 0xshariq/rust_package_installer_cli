import { Injectable } from "@nestjs/common";
import { CodeBuildClient, ListProjectsCommand, StartBuildCommand, BatchGetBuildsCommand, StopBuildCommand } from "@aws-sdk/client-codebuild";
@Injectable()
export class CodeBuildService {
  private client = new CodeBuildClient({ region: process.env.AWS_REGION });
  listProjects() { return this.client.send(new ListProjectsCommand({})); }
  startBuild(projectName: string, override?: any) { return this.client.send(new StartBuildCommand({ projectName, ...override })); }
  batchGetBuilds(ids: string[]) { return this.client.send(new BatchGetBuildsCommand({ ids })); }
  stopBuild(id: string, reason?: string) { return this.client.send(new StopBuildCommand({ id, reason })); }
}
