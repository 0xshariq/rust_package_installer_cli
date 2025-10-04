import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { uploadFile, listFiles } from "../../utils/s3";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const data = await uploadFile(body.key, body.content);
  return json(data);
};

export const loader = async ({ request }: any) => {
  const url = new URL(request.url);
  const prefix = url.searchParams.get("prefix") || undefined;
  const files = await listFiles(prefix);
  return json(files);
};
