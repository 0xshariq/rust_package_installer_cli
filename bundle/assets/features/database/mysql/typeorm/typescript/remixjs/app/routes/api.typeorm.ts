import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { AppDataSource } from "~/utils/typeorm";
export const loader: LoaderFunction = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const result = await AppDataSource.query("SELECT NOW()");
    return json({ time: result[0] });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};
