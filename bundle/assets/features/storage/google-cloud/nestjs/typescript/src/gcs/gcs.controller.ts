import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { GcsService } from "./gcs.service";

@Controller("gcs")
export class GcsController {
  constructor(private readonly gcs: GcsService) {}

  @Post("upload")
  upload(@Body() body: { key: string; base64: string }) {
    return this.gcs.uploadFile(body.key, body.base64);
  }

  @Get("list")
  list(@Query("prefix") prefix?: string) {
    return this.gcs.listFiles(prefix ?? "");
  }

  @Post("delete")
  delete(@Body() body: { key: string }) {
    return this.gcs.deleteFile(body.key);
  }
}
