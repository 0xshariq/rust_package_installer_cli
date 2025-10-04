import { generateContent } from '../utils/gemini.js';

export const generateResponse = async (req, res) => {
  const { prompt } = req.body;
  try {
    const output = await generateContent(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
