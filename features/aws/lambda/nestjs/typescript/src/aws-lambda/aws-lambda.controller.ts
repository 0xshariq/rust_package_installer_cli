import { Controller, Post, Get, Body } from "@nestjs/common";
import { AwsLambdaService } from "./aws-lambda.service";

@Controller("aws-lambda")
export class AwsLambdaController {
  constructor(private readonly svc: AwsLambdaService) {}

  @Get("functions")
  list() {
    return this.svc.listFunctions();
  }

  @Post("invoke")
  invoke(@Body() body: { functionName: string; payload: any; invocationType?: string }) {
    return this.svc.invoke(body.functionName, body.payload, body.invocationType);
  }
}
