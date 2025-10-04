import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export const sendMessage = async (messages: UIMessage[]) => {
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const result = streamText({
    model: openrouter("openai/gpt-4o"),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
};
