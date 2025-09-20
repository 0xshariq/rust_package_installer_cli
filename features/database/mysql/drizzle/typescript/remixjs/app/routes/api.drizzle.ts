import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/drizzle";

export const loader: LoaderFunction = async () => {
  try {
    const result = await db.execute("SELECT NOW()");
    return json({ time: result.rows[0] });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};
