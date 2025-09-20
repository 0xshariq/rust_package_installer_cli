import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { ImagekitService } from "./imagekit.service";

@Controller("imagekit")
export class ImagekitController {
  constructor(private readonly imagekitService: ImagekitService) {}

  @Post("upload")
  upload(@Body() body: { file: string; fileName: string; folder?: string }) {
    return this.imagekitService.uploadFile(body.file, body.fileName, body.folder);
  }

  @Get("list")
  list(@Query("path") path?: string) {
    return this.imagekitService.listFiles(path);
  }

  @Delete("delete/:fileId")
  delete(@Param("fileId") fileId: string) {
    return this.imagekitService.deleteFile(fileId);
  }
}
