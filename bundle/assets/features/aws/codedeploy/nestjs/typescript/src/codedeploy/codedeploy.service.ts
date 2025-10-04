import { Injectable } from "@nestjs/common";
import {
  CodeDeployClient,
  ListApplicationsCommand,
  CreateDeploymentCommand,
  GetDeploymentCommand,
  StopDeploymentCommand,
} from "@aws-sdk/client-codedeploy";

@Injectable()
export class CodeDeployService {
  private client = new CodeDeployClient({ region: process.env.AWS_REGION });

  listApplications() {
    return this.client.send(new ListApplicationsCommand({}));
  }

  createDeployment(params: {
    applicationName: string;
    deploymentGroupName?: string;
    revision?: any;
    description?: string;
    ignoreApplicationStopFailures?: boolean;
  }) {
    return this.client.send(new CreateDeploymentCommand(params));
  }

  getDeployment(deploymentId: string) {
    return this.client.send(new GetDeploymentCommand({ deploymentId }));
  }

  stopDeployment(deploymentId: string) {
    return this.client.send(new StopDeploymentCommand({ deploymentId }));
  }
}
