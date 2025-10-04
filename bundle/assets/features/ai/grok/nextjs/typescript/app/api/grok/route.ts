import { generateGrok } from "@/lib/grok";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json();
  try {
    const output = await generateGrok(prompt);
    return new Response(JSON.stringify({ output }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
