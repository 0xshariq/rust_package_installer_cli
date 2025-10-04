import { Module } from "@nestjs/common";
import { GrokService } from "./grok.service";
import { GrokController } from "./grok.controller";

@Module({
  controllers: [GrokController],
  providers: [GrokService],
})
export class GrokModule {}
