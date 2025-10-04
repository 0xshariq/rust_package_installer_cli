import { sendMessage } from "@/lib/openrouter.js";

export async function POST(req) {
  const { messages } = await req.json();
  try {
    return await sendMessage(messages);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
