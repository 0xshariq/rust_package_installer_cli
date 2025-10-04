import { Controller, Post, Body } from "@nestjs/common";
import { GrokService } from "./grok.service";

@Controller("grok")
export class GrokController {
  constructor(private readonly grokService: GrokService) {}

  @Post("generate")
  async generate(@Body("prompt") prompt: string) {
    return { output: await this.grokService.generate(prompt) };
  }
}
