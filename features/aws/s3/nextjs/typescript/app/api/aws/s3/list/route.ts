import type { NextApiRequest, NextApiResponse } from "next";
import { listFiles } from "@/utils/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const files = await listFiles(req.query.prefix as string | undefined);
      res.status(200).json(files);
    } catch (err) {
      res.status(500).json({ error: "Failed to list files", details: err });
    }
  } else {
    res.status(405).end();
  }
}
