import { describeAlarms } from "../utils/aws-cloudwatch";

export const getAlarms = async (req, res) => {
  try {
    const alarms = await describeAlarms();
    res.json(alarms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
