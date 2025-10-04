import { Controller, Get } from "@nestjs/common";
import { TypeOrmService } from "./typeorm.service";

@Controller("typeorm")
export class TypeOrmController {
  constructor(private readonly typeOrmService: TypeOrmService) {}

  @Get()
  async getTime() {
    return this.typeOrmService.getTime();
  }
}
