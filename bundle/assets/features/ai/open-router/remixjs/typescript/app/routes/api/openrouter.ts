import { json } from "@remix-run/node";
import { sendMessage } from "~/utils/openrouter";

export const action = async ({ request }): Promise<Response> => {
  const { messages } = await request.json();
  try {
    const output = await sendMessage(messages);
    return json({ output });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
