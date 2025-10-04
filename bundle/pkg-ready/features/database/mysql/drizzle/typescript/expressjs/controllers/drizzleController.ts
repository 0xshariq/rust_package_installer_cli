import { Request, Response } from "express";
import { db } from "../utils/drizzle";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await db.execute("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}