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

export async function signUpUser(clientId: string, username: string, password: string, email?: string) {
  const cmd = new SignUpCommand({
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: email ? [{ Name: "email", Value: email }] : undefined,
  });
  return client.send(cmd);
}

export async function signInUser(clientId: string, username: string, password: string) {
  const cmd = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });
  return client.send(cmd);
}

export async function adminCreateUser(userPoolId: string, username: string, temporaryPassword?: string, email?: string) {
  const cmd = new AdminCreateUserCommand({
    UserPoolId: userPoolId,
    Username: username,
    TemporaryPassword: temporaryPassword,
    UserAttributes: email ? [{ Name: "email", Value: email }] : undefined,
  });
  return client.send(cmd);
}

export async function listUsers(userPoolId: string) {
  const cmd = new ListUsersCommand({ UserPoolId: userPoolId });
  return client.send(cmd);
}

export async function adminDeleteUser(userPoolId: string, username: string) {
  const cmd = new AdminDeleteUserCommand({ UserPoolId: userPoolId, Username: username });
  return client.send(cmd);
}
