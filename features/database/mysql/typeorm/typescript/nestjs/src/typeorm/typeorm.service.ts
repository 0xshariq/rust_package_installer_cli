import { Injectable, OnModuleInit } from "@nestjs/common";
import { AppDataSource } from "../typeorm";

@Injectable()
export class TypeOrmService implements OnModuleInit {
  async onModuleInit() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async getTime() {
    const result = await AppDataSource.query("SELECT NOW()");
    return result[0];
  }
}
