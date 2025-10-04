import { grok } from "@ai-sdk/xai";

export const generateGrok = async (prompt) => {
  const response = await grok("grok-3.5").generateText({ prompt });
  return response.text();
};
