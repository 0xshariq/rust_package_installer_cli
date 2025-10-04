import { IAMClient, CreateUserCommand, ListUsersCommand, DeleteUserCommand } from "@aws-sdk/client-iam";

const client = new IAMClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const createUser = async (username: string) => {
  const command = new CreateUserCommand({ UserName: username });
  return await client.send(command);
};

export const listUsers = async () => {
  const command = new ListUsersCommand({});
  return await client.send(command);
};

export const deleteUser = async (username: string) => {
  const command = new DeleteUserCommand({ UserName: username });
  return await client.send(command);
};
