import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function uploadFile(key: string, body: Buffer | string) {
  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, Body: body });
  return s3Client.send(command);
}

export async function listFiles(prefix?: string) {
  const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix });
  const data = await s3Client.send(command);
  return data.Contents || [];
}
