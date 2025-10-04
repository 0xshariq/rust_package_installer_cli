import { json } from "@remix-run/node";
import { generateClaude } from "~/utils/claude";

export const action = async ({ request }) => {
  const { prompt } = await request.json();
  try {
    const output = await generateClaude(prompt);
    return json({ output });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
