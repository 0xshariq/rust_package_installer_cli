import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  uploadFile(file: string | Buffer, folder: string = "default") {
    return cloudinary.uploader.upload(file, { folder });
  }

  listFiles(prefix: string = "") {
    return cloudinary.search.expression(`folder:${prefix}/*`).max_results(100).execute()
      .then((res) => res.resources);
  }

  deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
