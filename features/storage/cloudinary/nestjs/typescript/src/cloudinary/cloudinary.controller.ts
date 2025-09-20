import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";

@Controller("cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  upload(@Body() body: { file: string; folder?: string }) {
    return this.cloudinaryService.uploadFile(body.file, body.folder);
  }

  @Get("list")
  list(@Query("prefix") prefix?: string) {
    return this.cloudinaryService.listFiles(prefix);
  }

  @Post("delete")
  delete(@Body() body: { publicId: string }) {
    return this.cloudinaryService.deleteFile(body.publicId);
  }
}
