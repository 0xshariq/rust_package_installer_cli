import { Module } from "@nestjs/common";
import { OpenRouterService } from "./openrouter.service";
import { OpenRouterController } from "./openrouter.controller";

@Module({
  controllers: [OpenRouterController],
  providers: [OpenRouterService],
})
export class OpenRouterModule {}
