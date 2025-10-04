import { Injectable } from '@nestjs/common';
import { google } from '@ai-sdk/google';

@Injectable()
export class GeminiService {
  async generateContent(prompt: string): Promise<string> {
    const { text } = await google('gemini-2.5-flash').generateText({ prompt });
    return text;
  }
}
