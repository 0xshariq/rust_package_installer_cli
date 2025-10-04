import { Module } from "@nestjs/common";
import { TypeOrmService } from "./typeorm.service";
import { TypeOrmController } from "./typeorm.controller";

@Module({
  providers: [TypeOrmService],
  controllers: [TypeOrmController],
})
export class TypeOrmModule {}
