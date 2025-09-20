import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class GcsService {
  private storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY
      ? {
          client_email: process.env.GCS_CLIENT_EMAIL,
          private_key: (process.env.GCS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }
      : undefined,
  });
  private bucket = this.storage.bucket(process.env.GCS_BUCKET!);

  async uploadFile(key: string, base64: string) {
    const buf = Buffer.from(base64, "base64");
    const file = this.bucket.file(key);
    await file.save(buf, { resumable: false });
    const [metadata] = await file.getMetadata();
    return { key, url: `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${key}`, metadata };
  }

  async listFiles(prefix = "") {
    const [files] = await this.bucket.getFiles({ prefix, autoPaginate: false, maxResults: 100 });
    return files.map(f => ({ key: f.name, updated: f.metadata?.updated, size: f.metadata?.size }));
  }

  async deleteFile(key: string) {
    await this.bucket.file(key).delete();
    return { deleted: key };
  }
}
