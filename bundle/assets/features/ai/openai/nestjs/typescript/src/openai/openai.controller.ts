import { Controller, Post, Body } from "@nestjs/common";
import { OpenAIService } from "./openai.service";

@Controller("openai")
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post("generate")
  async generate(@Body("prompt") prompt: string) {
    return { output: await this.openAIService.generateContent(prompt) };
  }
}
