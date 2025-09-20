import { Injectable } from "@nestjs/common";
import { CodePipelineClient, ListPipelinesCommand, GetPipelineCommand, StartPipelineExecutionCommand, GetPipelineExecutionCommand } from "@aws-sdk/client-codepipeline";

@Injectable()
export class CodePipelineService {
  private client = new CodePipelineClient({ region: process.env.AWS_REGION });

  listPipelines() {
    return this.client.send(new ListPipelinesCommand({}));
  }

  getPipeline(name: string) {
    return this.client.send(new GetPipelineCommand({ name }));
  }

  startPipelineExecution(name: string) {
    return this.client.send(new StartPipelineExecutionCommand({ name }));
  }

  getPipelineExecution(pipelineName: string, pipelineExecutionId: string) {
    return this.client.send(new GetPipelineExecutionCommand({ pipelineName, pipelineExecutionId }));
  }
}
