import { CodeDeployClient, ListApplicationsCommand, CreateDeploymentCommand, GetDeploymentCommand, StopDeploymentCommand } from "@aws-sdk/client-codedeploy";
const client = new CodeDeployClient({ region: process.env.AWS_REGION });
export const listApplications = () => client.send(new ListApplicationsCommand({}));
export const createDeployment = (params: any) => client.send(new CreateDeploymentCommand(params));
export const getDeployment = (id: string) => client.send(new GetDeploymentCommand({ deploymentId: id }));
export const stopDeployment = (id: string) => client.send(new StopDeploymentCommand({ deploymentId: id }));
