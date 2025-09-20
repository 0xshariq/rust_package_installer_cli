import { Injectable } from "@nestjs/common";
import ImageKit from "imagekit";

@Injectable()
export class ImagekitService {
  private imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });

  async uploadFile(file: Buffer | string, fileName: string, folder: string = "/") {
    return this.imagekit.upload({ file, fileName, folder });
  }

  async listFiles(path: string = "/") {
    const result: any = await this.imagekit.listFiles({ path, limit: 100 });
    return result;
  }
  async deleteFile(fileId: string) {
    return this.imagekit.deleteFile(fileId);
  }
}
