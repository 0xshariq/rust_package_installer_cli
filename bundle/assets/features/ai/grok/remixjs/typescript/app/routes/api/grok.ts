import { json } from "@remix-run/node";
import { generateGrok } from "../../utils/grok";

export const action = async ({ request }): Promise<Response> => {
  const { prompt } = await request.json();
  try {
    const output = await generateGrok(prompt);
    return json({ output });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
