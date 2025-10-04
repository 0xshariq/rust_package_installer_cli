import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE, // Path to your service account JSON key
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

export async function uploadFile(file) {
  const blob = bucket.file(file.originalFilename);
  const blobStream = blob.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    });
    blobStream.end(file.buffer);
  });
}

export async function deleteFile(fileName) {
  await bucket.file(fileName).delete();
  return { success: true, message: `${fileName} deleted.` };
}
