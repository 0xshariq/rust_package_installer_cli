import { Request, Response } from "express";
import { encryptData, decryptData, listKeys } from "../utils/awsKms";

export const getKeys = async (_req: Request, res: Response) => {
  try {
    const data = await listKeys();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const encrypt = async (req: Request, res: Response) => {
  try {
    const { keyId, plaintext } = req.body;
    const data = await encryptData(keyId, plaintext);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export const decrypt = async (req: Request, res: Response) => {
  try {
    const { ciphertext } = req.body;
    const data = await decryptData(ciphertext);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
