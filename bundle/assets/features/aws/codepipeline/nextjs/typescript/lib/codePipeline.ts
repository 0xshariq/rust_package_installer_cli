import { CodePipelineClient, ListPipelinesCommand, GetPipelineCommand, StartPipelineExecutionCommand, GetPipelineExecutionCommand } from "@aws-sdk/client-codepipeline";
const client = new CodePipelineClient({ region: process.env.AWS_REGION });
export function listPipelines() { return client.send(new ListPipelinesCommand({})); }
export function getPipeline(name: string) { return client.send(new GetPipelineCommand({ name })); }
export function startPipelineExecution(name: string) { return client.send(new StartPipelineExecutionCommand({ name })); }
export function getPipelineExecution(pipelineName: string, executionId: string) { return client.send(new GetPipelineExecutionCommand({ pipelineName, pipelineExecutionId: executionId })); }
