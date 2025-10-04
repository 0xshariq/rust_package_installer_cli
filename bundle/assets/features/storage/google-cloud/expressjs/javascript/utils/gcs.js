import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY
    ? {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: (process.env.GCS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }
    : undefined,
});
const BUCKET = storage.bucket(process.env.GCS_BUCKET);

export async function uploadFile(key, base64) {
  const buf = Buffer.from(base64, "base64");
  const file = BUCKET.file(key);
  await file.save(buf, { resumable: false });
  const [metadata] = await file.getMetadata();
  return { key, url: `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${key}`, metadata };
}

export async function listFiles(prefix = "") {
  const [files] = await BUCKET.getFiles({ prefix, autoPaginate: false, maxResults: 100 });
  return files.map(f => ({ key: f.name, updated: f.metadata?.updated, size: f.metadata?.size }));
}

export async function deleteFile(key) {
  await BUCKET.file(key).delete();
  return { deleted: key };
}
