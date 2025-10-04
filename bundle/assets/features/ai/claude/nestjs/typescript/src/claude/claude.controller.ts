import { Controller, Post, Body } from "@nestjs/common";
import { ClaudeService } from "./claude.service";

@Controller("claude")
export class ClaudeController {
  constructor(private readonly claudeService: ClaudeService) {}

  @Post("generate")
  async generate(@Body("prompt") prompt: string) {
    return { output: await this.claudeService.generate(prompt) };
  }
}
