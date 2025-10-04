import { generateContent } from '@/lib/gemini';

export async function POST(req) {
  const { prompt } = await req.json();
  try {
    const output = await generateContent(prompt);
    return new Response(JSON.stringify({ output }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
