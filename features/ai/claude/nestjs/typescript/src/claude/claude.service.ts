import { Injectable } from "@nestjs/common";
import { Anthropic } from "@anthropic-ai/sdk";

@Injectable()
export class ClaudeService {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async generate(prompt: string): Promise<string> {
    const response = await this.client.completions.create({
      model: "claude-3.7",
      prompt,
      max_tokens_to_sample: 1000,
    });
    return response.completion;
  }
}
