import { Request, Response } from "express";
import { generateClaude } from "../utils/claude";

export const handleClaude = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;
  try {
    const output = await generateClaude(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
