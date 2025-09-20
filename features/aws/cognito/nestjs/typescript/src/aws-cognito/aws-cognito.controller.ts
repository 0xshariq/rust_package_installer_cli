import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { AwsCognitoService } from "./aws-cognito.service";

@Controller("aws-cognito")
export class AwsCognitoController {
  constructor(private readonly svc: AwsCognitoService) {}

  @Post()
  action(@Body() body: any) {
    const { type, payload } = body;
    switch (type) {
      case "signup": return this.svc.signUpUser(payload.clientId, payload.username, payload.password, payload.email);
      case "signin": return this.svc.signInUser(payload.clientId, payload.username, payload.password);
      case "adminCreate": return this.svc.adminCreateUser(payload.userPoolId, payload.username, payload.temporaryPassword, payload.email);
      case "delete": return this.svc.adminDeleteUser(payload.userPoolId, payload.username);
      default: return { error: "invalid type" };
    }
  }

  @Get("users")
  list(@Query("userPoolId") userPoolId: string) {
    return this.svc.listUsers(userPoolId);
  }
}
