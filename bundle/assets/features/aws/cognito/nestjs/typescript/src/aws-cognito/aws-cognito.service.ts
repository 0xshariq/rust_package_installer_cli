import { Injectable } from "@nestjs/common";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminCreateUserCommand,
  ListUsersCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

@Injectable()
export class AwsCognitoService {
  private client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    ...(process.env.AWS_ACCESS_KEY_ID ? {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    } : {})
  });

  signUpUser(clientId: string, username: string, password: string, email?: string) {
    return this.client.send(new SignUpCommand({ ClientId: clientId, Username: username, Password: password, UserAttributes: email ? [{ Name: "email", Value: email }] : undefined }));
  }

  signInUser(clientId: string, username: string, password: string) {
    return this.client.send(new InitiateAuthCommand({ AuthFlow: "USER_PASSWORD_AUTH", ClientId: clientId, AuthParameters: { USERNAME: username, PASSWORD: password } }));
  }

  adminCreateUser(userPoolId: string, username: string, temporaryPassword?: string, email?: string) {
    return this.client.send(new AdminCreateUserCommand({ UserPoolId: userPoolId, Username: username, TemporaryPassword: temporaryPassword, UserAttributes: email ? [{ Name: "email", Value: email }] : undefined }));
  }

  listUsers(userPoolId: string) {
    return this.client.send(new ListUsersCommand({ UserPoolId: userPoolId }));
  }

  adminDeleteUser(userPoolId: string, username: string) {
    return this.client.send(new AdminDeleteUserCommand({ UserPoolId: userPoolId, Username: username }));
  }
}
