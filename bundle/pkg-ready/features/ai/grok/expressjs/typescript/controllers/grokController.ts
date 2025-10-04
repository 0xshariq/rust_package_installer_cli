import { Request, Response } from "express";
import { generateGrok } from "../utils/grok";

export const handleGrok = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;
  try {
    const output = await generateGrok(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
