import { Injectable } from "@nestjs/common";
import { CodeCommitClient, ListRepositoriesCommand, GetRepositoryCommand, CreateRepositoryCommand, DeleteRepositoryCommand } from "@aws-sdk/client-codecommit";

@Injectable()
export class CodeCommitService {
  private client = new CodeCommitClient({ region: process.env.AWS_REGION });
  listRepositories() { return this.client.send(new ListRepositoriesCommand({})); }
  getRepository(name: string) { return this.client.send(new GetRepositoryCommand({ repositoryName: name })); }
  createRepository(name: string, description?: string) { return this.client.send(new CreateRepositoryCommand({ repositoryName: name, repositoryDescription: description })); }
  deleteRepository(name: string) { return this.client.send(new DeleteRepositoryCommand({ repositoryName: name })); }
}
