import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  entities: [],
  synchronize: true,
});
