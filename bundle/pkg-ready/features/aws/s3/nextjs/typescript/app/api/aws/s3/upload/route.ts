import type { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "@/utils/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { key, content } = req.body;
    try {
      const data = await uploadFile(key, content);
      res.status(200).json({ message: "File uploaded", data });
    } catch (err) {
      res.status(500).json({ error: "Upload failed", details: err });
    }
  } else {
    res.status(405).end();
  }
}
