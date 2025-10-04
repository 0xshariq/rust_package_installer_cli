import { Request, Response } from "express";
import { uploadFile, listFiles, deleteFile } from "../utils/imagekit";

export async function upload(req: Request, res: Response) {
  try {
    const { file, fileName, folder } = req.body;
    const data = await uploadFile(file, fileName, folder);
    res.json({ message: "Uploaded successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const path = req.query.path as string || "/";
    const files = await listFiles(path);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to list files", details: err });
  }
}
export async function deletefile(req: Request, res: Response) {
  try {
    const { fileId } = req.params;
    const result = await deleteFile(fileId);
    res.json({ message: "Deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err });
  }
}