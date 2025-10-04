import {
  CodeCommitClient,
  ListRepositoriesCommand,
  CreateRepositoryCommand,
  GetRepositoryCommand,
  DeleteRepositoryCommand,
} from "@aws-sdk/client-codecommit";
const client = new CodeCommitClient({ region: process.env.AWS_REGION });
export function listRepositories() {
  return client.send(new ListRepositoriesCommand({}));
}
export function getRepository(name) {
  return client.send(new GetRepositoryCommand({ repositoryName: name }));
}
export function createRepository(name, description) {
  return client.send(
    new CreateRepositoryCommand({
      repositoryName: name,
      repositoryDescription: description,
    })
  );
}
export function deleteRepository(name) {
  return client.send(new DeleteRepositoryCommand({ repositoryName: name }));
}
