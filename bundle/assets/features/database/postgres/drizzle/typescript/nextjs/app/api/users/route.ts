import { db } from "@/lib/db";

export async function GET(): Promise<Response> {
  try {
    // Example query
    const result = await db.execute("SELECT NOW()");
    return new Response(JSON.stringify({ time: result.rows[0] }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
