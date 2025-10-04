import { AppDataSource } from "@/lib/typeorm";

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const result = await AppDataSource.query("SELECT NOW()");
    return new Response(JSON.stringify({ time: result[0] }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
