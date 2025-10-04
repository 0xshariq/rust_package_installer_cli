import { CodeBuildClient, ListProjectsCommand, StartBuildCommand, BatchGetBuildsCommand, StopBuildCommand } from "@aws-sdk/client-codebuild";
const client = new CodeBuildClient({ region: process.env.AWS_REGION });
export const listProjects = () => client.send(new ListProjectsCommand({}));
export const startBuild = (projectName: string, override?: any) => client.send(new StartBuildCommand({ projectName, ...override }));
export const batchGetBuilds = (ids: string[]) => client.send(new BatchGetBuildsCommand({ ids }));
export const stopBuild = (id: string, reason?: string) => client.send(new StopBuildCommand({ id, reason }));
