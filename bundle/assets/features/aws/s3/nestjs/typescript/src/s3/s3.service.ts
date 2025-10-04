import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  private bucketName = process.env.AWS_BUCKET_NAME!;

  async uploadFile(key: string, body: Buffer | string) {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: body });
    return this.s3Client.send(command);
  }

  async listFiles(prefix?: string) {
    const command = new ListObjectsV2Command({ Bucket: this.bucketName, Prefix: prefix });
    const data = await this.s3Client.send(command);
    return data.Contents || [];
  }
}
