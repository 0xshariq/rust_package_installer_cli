import { describeChecks } from "../utils/aws-trustedadvisor.js";

export const getChecks = async (req, res) => {
  try {
    const checks = await describeChecks();
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
