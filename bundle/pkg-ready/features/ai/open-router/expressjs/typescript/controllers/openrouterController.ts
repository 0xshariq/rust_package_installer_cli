import { Request, Response } from "express";
import { sendMessage } from "../utils/openrouter";

export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  const { messages } = req.body;
  try {
    const response = await sendMessage(messages);
    res.json({ output: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
