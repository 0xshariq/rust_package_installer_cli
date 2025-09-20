import {
    CodePipelineClient,
    ListPipelinesCommand,
    GetPipelineCommand,
    StartPipelineExecutionCommand,
    GetPipelineExecutionCommand,
} from "@aws-sdk/client-codepipeline";

const client = new CodePipelineClient({ region: process.env.AWS_REGION });

export const listPipelines = () => client.send(new ListPipelinesCommand({}));
export const getPipeline = (name: string) => client.send(new GetPipelineCommand({ name }));
export const startPipelineExecution = (name: string) => client.send(new StartPipelineExecutionCommand({ name }));
export const getPipelineExecution = (pipelineName: string, pipelineExecutionId: string) =>
    client.send(new GetPipelineExecutionCommand({ pipelineName, pipelineExecutionId }));
