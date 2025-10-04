import { json } from "@remix-run/node";
import { describeTrails } from "../../utils/aws-cloudtrail";

export const loader = async () => {
  try {
    const trails = await describeTrails();
    return json(trails);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
};
