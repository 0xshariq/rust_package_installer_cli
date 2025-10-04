import { AppDataSource } from "@/lib/typeorm";

export async function GET(): Promise<Response> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const result = await AppDataSource.query("SELECT NOW()");
    return new Response(JSON.stringify({ time: result[0] }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
