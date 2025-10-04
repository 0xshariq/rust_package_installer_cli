import { uploadFile, listFiles, deleteFile } from "../utils/gcs.js";

export const upload = async (req, res) => {
  try {
    const { key, base64 } = req.body;
    const data = await uploadFile(key, base64);
    res.json({ message: "Uploaded", data });
  } catch (e) {
    res.status(500).json({ error: "Upload failed", details: String(e) });
  }
};

export const list = async (req, res) => {
  try {
    const prefix = req.query.prefix || "";
    const files = await listFiles(prefix);
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: "List failed", details: String(e) });
  }
};

export const deletefile = async (req, res) => {
  try {
    const { key } = req.body;
    const data = await deleteFile(key);
    res.json({ message: "Deleted", data });
  } catch (e) {
    res.status(500).json({ error: "Delete failed", details: String(e) });
  }
};
