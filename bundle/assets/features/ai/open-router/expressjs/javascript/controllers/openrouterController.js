import { sendMessage } from "../utils/openrouter.js";

export const handleMessage = async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await sendMessage(messages);
    res.json({ output: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
