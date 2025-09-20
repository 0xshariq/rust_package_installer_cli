import { CodeCommitClient, ListRepositoriesCommand, CreateRepositoryCommand, GetRepositoryCommand, DeleteRepositoryCommand } from "@aws-sdk/client-codecommit";

const client = new CodeCommitClient({ region: process.env.AWS_REGION });

export async function listRepositories() {
  return client.send(new ListRepositoriesCommand({}));
}

export async function getRepository(repositoryName: string) {
  return client.send(new GetRepositoryCommand({ repositoryName }));
}

export async function createRepository(repositoryName: string, description?: string) {
  return client.send(new CreateRepositoryCommand({ repositoryName, repositoryDescription: description }));
}

export async function deleteRepository(repositoryName: string) {
  return client.send(new DeleteRepositoryCommand({ repositoryName }));
}
