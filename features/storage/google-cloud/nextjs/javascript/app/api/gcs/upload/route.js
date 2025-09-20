
import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_KEY_JSON),
});
const bucketName = process.env.GCP_BUCKET;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}-${file.name}`;
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(buffer, {
      metadata: { contentType: file.type },
      resumable: false,
    });

    return NextResponse.json({ url: `https://storage.googleapis.com/${bucketName}/${fileName}` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
