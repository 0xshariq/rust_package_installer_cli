import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages } from "ai";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export const sendMessage = async (messages) => {
  const result = streamText({
    model: openrouter("openai/gpt-4o"),
    messages: convertToModelMessages(messages),
  });
  return result.toString();
};
