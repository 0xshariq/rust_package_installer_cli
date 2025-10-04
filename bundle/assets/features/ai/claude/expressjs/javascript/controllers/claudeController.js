import { generateClaude } from "../utils/claude.js";

export const handleClaude = async (req, res) => {
  const { prompt } = req.body;
  try {
    const output = await generateClaude(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
