import { AppDataSource } from "../utils/typeorm.js";

export async function getData(req, res) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const result = await AppDataSource.query("SELECT NOW()");
    res.json({ time: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}