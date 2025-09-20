import { json } from "@remix-run/node";
import { describeAlarms } from "../../utils/aws-cloudwatch";

export const loader = async () => {
  try {
    const alarms = await describeAlarms();
    return json(alarms);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
};
