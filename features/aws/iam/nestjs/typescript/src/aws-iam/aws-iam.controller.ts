import { Controller, Post, Get, Delete, Body } from "@nestjs/common";
import { AwsIamService } from "./aws-iam.service";

@Controller("aws-iam")
export class AwsIamController {
  constructor(private readonly service: AwsIamService) {}

  @Post("user")
  create(@Body("username") username: string) {
    return this.service.createUser(username);
  }

  @Get("users")
  list() {
    return this.service.listUsers();
  }

  @Delete("user")
  delete(@Body("username") username: string) {
    return this.service.deleteUser(username);
  }
}
