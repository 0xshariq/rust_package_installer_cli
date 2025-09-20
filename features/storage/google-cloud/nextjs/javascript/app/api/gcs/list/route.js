import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE,
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

export async function GET() {
  try {
    const [files] = await bucket.getFiles();
    const fileList = files.map(file => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    }));

    return NextResponse.json({ files: fileList });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
