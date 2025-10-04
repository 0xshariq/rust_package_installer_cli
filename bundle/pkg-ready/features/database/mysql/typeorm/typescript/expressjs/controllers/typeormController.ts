import { AppDataSource } from "../utils/typeorm";
import { Request, Response} from "express";

export async function getData(req: Request, res: Response) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const result = await AppDataSource.query("SELECT NOW()");
    res.json({ time: result[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}