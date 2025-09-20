import { json } from "@remix-run/node";
import { describeChecks } from "~/utils/aws-trustedadvisor";

export const loader = async () => {
  try {
    const checks = await describeChecks();
    return json(checks);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
};
