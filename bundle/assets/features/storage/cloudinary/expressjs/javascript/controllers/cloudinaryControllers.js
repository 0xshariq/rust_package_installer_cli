import { uploadFile, listFiles, deleteFile } from "../utils/cloudinary.js";

export async function upload(req, res) {
  try {
    const { file, folder } = req.body;
    const data = await uploadFile(file, folder);
    res.json({ message: "Uploaded successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
}

export async function list(req, res) {
  try {
    const prefix = req.query.prefix || "";
    const files = await listFiles(prefix);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "List failed", details: err });
  }
}

export async function remove(req, res) {
  try {
    const { publicId } = req.body;
    const data = await deleteFile(publicId);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err });
  }
}
