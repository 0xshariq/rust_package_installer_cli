import { LambdaClient, InvokeCommand, ListFunctionsCommand } from "@aws-sdk/client-lambda";

const client = new LambdaClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {})
});

export function listFunctions() {
  return client.send(new ListFunctionsCommand({}));
}

export async function invokeLambdaFunction(functionName, payload = {}) {
  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  const response = await client.send(command);
  const result = response.Payload ? JSON.parse(new TextDecoder().decode(response.Payload)) : null;
  return result;
}
