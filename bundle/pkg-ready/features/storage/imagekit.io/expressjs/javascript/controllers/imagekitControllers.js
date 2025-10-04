import { uploadFile, listFiles, deletefile } from "../utils/imagekit.js";

export async function upload(req, res) {
  try {
    const { file, fileName, folder } = req.body;
    const data = await uploadFile(file, fileName, folder);
    res.json({ message: "Uploaded successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
}

export async function list(req, res) {
  try {
    const path = req.query.path || "/";
    const files = await listFiles(path);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to list files", details: err });
  }
}
export async function deletefile(req, res) {
  try {
    const { fileId } = req.body;
    const data = await deletefile(fileId);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err });
  }
}
