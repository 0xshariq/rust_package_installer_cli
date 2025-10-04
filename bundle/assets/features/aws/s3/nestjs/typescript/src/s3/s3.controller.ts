import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { S3Service } from "./s3.service";

@Controller("s3")
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post("upload")
  upload(@Body() body: { key: string; content: string }) {
    return this.s3Service.uploadFile(body.key, body.content);
  }

  @Get("list")
  list(@Query("prefix") prefix?: string) {
    return this.s3Service.listFiles(prefix);
  }
}
