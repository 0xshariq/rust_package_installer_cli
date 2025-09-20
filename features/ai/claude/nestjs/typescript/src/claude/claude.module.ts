import { Module } from "@nestjs/common";
import { ClaudeService } from "./claude.service";
import { ClaudeController } from "./claude.controller";

@Module({
  controllers: [ClaudeController],
  providers: [ClaudeService],
})
export class ClaudeModule {}
