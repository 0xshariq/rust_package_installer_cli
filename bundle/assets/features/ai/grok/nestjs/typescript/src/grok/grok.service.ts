import { Injectable } from "@nestjs/common";
import { grok } from "@ai-sdk/xai";

@Injectable()
export class GrokService {
  async generate(prompt: string): Promise<string> {
    const response = await grok("grok-3.5").generateText({ prompt });
    return response.text();
  }
}
