import { sendMessage } from "@/lib/openrouter";

export async function POST(req: Request) {
  const { messages } = await req.json();
  try {
    return await sendMessage(messages);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
