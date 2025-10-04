import { Injectable } from "@nestjs/common";
import { LambdaClient, InvokeCommand, ListFunctionsCommand } from "@aws-sdk/client-lambda";

@Injectable()
export class AwsLambdaService {
  private client = new LambdaClient({
    region: process.env.AWS_REGION,
    ...(process.env.AWS_ACCESS_KEY_ID ? {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    } : {})
  });

  listFunctions() {
    return this.client.send(new ListFunctionsCommand({}));
  }

  async invoke(functionName: string, payload: any, invocationType = "RequestResponse") {
    const cmd = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
      InvocationType: invocationType,
    });
    const res = await this.client.send(cmd);
    const raw = res.Payload ? Buffer.from(res.Payload).toString() : undefined;
    try { return { rawResponse: res, payload: raw ? JSON.parse(raw) : null }; }
    catch { return { rawResponse: res, payload: raw }; }
  }
}
