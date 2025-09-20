import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadFile(file: string | Buffer, folder: string = "default") {
  return cloudinary.uploader.upload(file, { folder });
}

export async function listFiles(prefix: string = "") {
  const result = await cloudinary.search
    .expression(`folder:${prefix}/*`)
    .max_results(100)
    .execute();
  return result.resources;
}

export async function deleteFile(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
