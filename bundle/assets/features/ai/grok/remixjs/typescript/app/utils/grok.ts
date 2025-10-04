import { grok } from "@ai-sdk/xai";

export const generateGrok = async (prompt: string): Promise<string> => {
  const response = await grok("grok-3.5").generateText({ prompt });
  return response.text();
};
