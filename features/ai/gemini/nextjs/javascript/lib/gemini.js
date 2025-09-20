import { google } from '@ai-sdk/google';

export const generateContent = async (prompt) => {
  const { text } = await google('gemini-2.5-flash').generateText({ prompt });
  return text;
};
