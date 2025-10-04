import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class OpenAIService {
  async generateContent(prompt: string): Promise<string> {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  }
}
