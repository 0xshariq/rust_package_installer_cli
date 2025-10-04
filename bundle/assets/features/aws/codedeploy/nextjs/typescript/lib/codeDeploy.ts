import { CodeDeployClient, ListApplicationsCommand, CreateDeploymentCommand, GetDeploymentCommand, StopDeploymentCommand } from "@aws-sdk/client-codedeploy";
const client = new CodeDeployClient({ region: process.env.AWS_REGION });
export function listApplications() { return client.send(new ListApplicationsCommand({})); }
export function createDeployment(params: any) { return client.send(new CreateDeploymentCommand(params)); }
export function getDeployment(deploymentId: string) { return client.send(new GetDeploymentCommand({ deploymentId })); }
export function stopDeployment(deploymentId: string) { return client.send(new StopDeploymentCommand({ deploymentId })); }
