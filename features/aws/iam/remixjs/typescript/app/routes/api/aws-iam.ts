import { json } from "@remix-run/node";
import { IAMClient, CreateUserCommand, ListUsersCommand, DeleteUserCommand } from "@aws-sdk/client-iam";

const client = new IAMClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const action = async ({ request }: any) => {
  const body = await request.json();
  const { username, type } = body;

  if (type === "create") {
    const command = new CreateUserCommand({ UserName: username });
    const data = await client.send(command);
    return json(data);
  }

  if (type === "delete") {
    const command = new DeleteUserCommand({ UserName: username });
    const data = await client.send(command);
    return json(data);
  }

  return json({ error: "Invalid type" }, { status: 400 });
};

export const loader = async () => {
  const command = new ListUsersCommand({});
  const data = await client.send(command);
  return json(data);
};
