import { Injectable } from "@nestjs/common";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";

@Injectable()
export class OpenRouterService {
  private openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

  async sendMessage(messages: UIMessage[]): Promise<string> {
    const result = streamText({
      model: this.openrouter("openai/gpt-4o"),
      messages: convertToModelMessages(messages),
    });
    return result.toString();
  }
}
