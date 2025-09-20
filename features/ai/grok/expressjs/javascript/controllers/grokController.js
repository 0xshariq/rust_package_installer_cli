import { generateGrok } from "../utils/grok.js";

export const handleGrok = async (req, res) => {
  const { prompt } = req.body;
  try {
    const output = await generateGrok(prompt);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
