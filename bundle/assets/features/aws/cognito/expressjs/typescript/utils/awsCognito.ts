import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminCreateUserCommand,
  ListUsersCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  } : {})
});

export function signUpUser(clientId: string, username: string, password: string, email?: string) {
  return client.send(new SignUpCommand({ ClientId: clientId, Username: username, Password: password, UserAttributes: email ? [{ Name: "email", Value: email }] : undefined }));
}

export function signInUser(clientId: string, username: string, password: string) {
  return client.send(new InitiateAuthCommand({ AuthFlow: "USER_PASSWORD_AUTH", ClientId: clientId, AuthParameters: { USERNAME: username, PASSWORD: password } }));
}

export function adminCreateUser(userPoolId: string, username: string, temporaryPassword?: string, email?: string) {
  return client.send(new AdminCreateUserCommand({ UserPoolId: userPoolId, Username: username, TemporaryPassword: temporaryPassword, UserAttributes: email ? [{ Name: "email", Value: email }] : undefined }));
}

export function listUsers(userPoolId: string) {
  return client.send(new ListUsersCommand({ UserPoolId: userPoolId }));
}

export function adminDeleteUser(userPoolId: string, username: string) {
  return client.send(new AdminDeleteUserCommand({ UserPoolId: userPoolId, Username: username }));
}
