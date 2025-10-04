import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { uploadFile, listFiles, deletefile } from "../../utils/imagekit";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const { file, fileName, folder } = body;
  const data = await uploadFile(file, fileName, folder);
  return json(data);
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "/";
  const files = await listFiles(path);
  return json(files);
};
export const deleteAction: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const { fileId } = body;
  const data = await deletefile(fileId);
  return json(data);
};
