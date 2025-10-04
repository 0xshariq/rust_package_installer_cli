import { json } from "@remix-run/node";
import { generateContent } from "~/utils/openai";

export const action = async ({ request }): Promise<Response> => {
  const { prompt } = await request.json();
  try {
    const output = await generateContent(prompt);
    return json({ output });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
