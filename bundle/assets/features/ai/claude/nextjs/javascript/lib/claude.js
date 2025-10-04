import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const generateClaude = async (prompt) => {
  const response = await client.completions.create({
    model: "claude-3.7",
    prompt,
    max_tokens_to_sample: 1000,
  });
  return response.completion;
};
