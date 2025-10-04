import { Injectable } from "@nestjs/common";
import { IAMClient, CreateUserCommand, ListUsersCommand, DeleteUserCommand } from "@aws-sdk/client-iam";

@Injectable()
export class AwsIamService {
  private client = new IAMClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  createUser(username: string) {
    return this.client.send(new CreateUserCommand({ UserName: username }));
  }

  listUsers() {
    return this.client.send(new ListUsersCommand({}));
  }

  deleteUser(username: string) {
    return this.client.send(new DeleteUserCommand({ UserName: username }));
  }
}
