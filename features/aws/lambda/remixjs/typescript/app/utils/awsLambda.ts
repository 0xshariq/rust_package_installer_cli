import { LambdaClient, InvokeCommand, ListFunctionsCommand } from "@aws-sdk/client-lambda";

const client = new LambdaClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  } : {})
});

export function listFunctions() {
  return client.send(new ListFunctionsCommand({}));
}

export async function invokeFunction(functionName: string, payload: any, invocationType = "RequestResponse") {
  const cmd = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(JSON.stringify(payload)),
    InvocationType: invocationType,
  });
  const res = await client.send(cmd);
  const raw = res.Payload ? Buffer.from(res.Payload).toString() : undefined;
  try { return { rawResponse: res, payload: raw ? JSON.parse(raw) : null }; }
  catch { return { rawResponse: res, payload: raw }; }
}
