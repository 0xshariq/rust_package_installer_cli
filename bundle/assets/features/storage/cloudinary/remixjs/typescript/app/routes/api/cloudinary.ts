import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { uploadFile, listFiles, deleteFile } from "../../utils/cloudinary";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  if (body.action === "upload") {
    const data = await uploadFile(body.file, body.folder);
    return json(data);
  } else if (body.action === "delete") {
    const data = await deleteFile(body.publicId);
    return json(data);
  }
  return json({ error: "Invalid action" }, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const prefix = url.searchParams.get("prefix") || "";
  const files = await listFiles(prefix);
  return json(files);
};
