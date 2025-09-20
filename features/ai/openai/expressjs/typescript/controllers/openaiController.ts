import { Request, Response } from "express";
import { generateContent } from "../utils/openai";

export const generateResponse = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;
  try {
    const output = await generateContent(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
