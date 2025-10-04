import { CodeCommitClient, ListRepositoriesCommand, CreateRepositoryCommand, GetRepositoryCommand, DeleteRepositoryCommand } from "@aws-sdk/client-codecommit";
const client = new CodeCommitClient({ region: process.env.AWS_REGION });

export const listRepositories = () => client.send(new ListRepositoriesCommand({}));
export const getRepository = (repositoryName: string) => client.send(new GetRepositoryCommand({ repositoryName }));
export const createRepository = (repositoryName: string, description?: string) => client.send(new CreateRepositoryCommand({ repositoryName, repositoryDescription: description }));
export const deleteRepository = (repositoryName: string) => client.send(new DeleteRepositoryCommand({ repositoryName }));
