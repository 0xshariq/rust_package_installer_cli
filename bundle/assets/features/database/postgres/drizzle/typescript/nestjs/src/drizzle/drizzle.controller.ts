import { Controller, Get } from "@nestjs/common";
import { DrizzleService } from "./drizzle.service";

@Controller("drizzle")
export class DrizzleController {
  constructor(private readonly drizzleService: DrizzleService) {}

  @Get()
  async getTime() {
    return this.drizzleService.getTime();
  }
}
