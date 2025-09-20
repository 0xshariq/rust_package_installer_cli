import { Injectable } from "@nestjs/common";
import { db } from "../drizzle";

@Injectable()
export class DrizzleService {
  async getTime() {
    const result = await db.execute("SELECT NOW()");
    return result.rows[0];
  }
}
