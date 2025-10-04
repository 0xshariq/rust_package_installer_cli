import { Controller, Post, Body } from "@nestjs/common";
import { OpenRouterService } from "./openrouter.service";
import { UIMessage } from "ai";

@Controller("openrouter")
export class OpenRouterController {
  constructor(private readonly openRouterService: OpenRouterService) {}

  @Post("send")
  async send(@Body("messages") messages: UIMessage[]) {
    return { output: await this.openRouterService.sendMessage(messages) };
  }
}
