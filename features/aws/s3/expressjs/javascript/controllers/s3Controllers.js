import { Request, Response } from "express";
import { uploadFile, listFiles } from "../utils/s3.js";

export async function upload(req: Request, res: Response) {
  const { key, content } = req.body;
  try {
    const data = await uploadFile(key, content);
    res.json({ message: "File uploaded", data });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const files = await listFiles(req.query.prefix as string | undefined);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to list files", details: err });
  }
}
