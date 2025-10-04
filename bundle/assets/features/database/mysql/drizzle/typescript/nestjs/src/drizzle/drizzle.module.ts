import { Module } from "@nestjs/common";
import { DrizzleService } from "./drizzle.service";
import { DrizzleController } from "./drizzle.controller";

@Module({
  providers: [DrizzleService],
  controllers: [DrizzleController],
})
export class DrizzleModule {}
