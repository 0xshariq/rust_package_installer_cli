import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadFile(file: Buffer | string, fileName: string, folder: string = "/") {
  return imagekit.upload({ file, fileName, folder });
}

export async function listFiles(path: string = "/") {
  const result: any = await imagekit.listFiles({ path, limit: 100 });
  return result;
}
export async function deleteFile(fileId: string) {
  return imagekit.deleteFile(fileId);
}