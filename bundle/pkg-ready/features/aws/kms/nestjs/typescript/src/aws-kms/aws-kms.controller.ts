import { Controller, Get, Post, Put, Body } from "@nestjs/common";
import { AwsKmsService } from "./aws-kms.service";

@Controller("aws-kms")
export class AwsKmsController {
  constructor(private readonly service: AwsKmsService) {}

  @Get("keys")
  list() {
    return this.service.listKeys();
  }

  @Post("encrypt")
  encrypt(@Body() body: { keyId: string; plaintext: string }) {
    return this.service.encrypt(body.keyId, body.plaintext);
  }

  @Put("decrypt")
  decrypt(@Body("ciphertext") ciphertext: string) {
    return this.service.decrypt(ciphertext);
  }
}
