import { CodeBuildClient, ListProjectsCommand, StartBuildCommand, BatchGetBuildsCommand, StopBuildCommand } from "@aws-sdk/client-codebuild";
const client = new CodeBuildClient({ region: process.env.AWS_REGION });
export function listProjects() { return client.send(new ListProjectsCommand({})); }
export function startBuild(projectName: string, override?: any) { return client.send(new StartBuildCommand({ projectName, ...override })); }
export function batchGetBuilds(ids: string[]) { return client.send(new BatchGetBuildsCommand({ ids })); }
export function stopBuild(id: string, reason?: string) { return client.send(new StopBuildCommand({ id, reason })); }
