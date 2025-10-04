import { describeTrails } from "../utils/aws-cloudtrail.js";

export const getTrails = async (req, res) => {
  try {
    const trails = await describeTrails();
    res.json(trails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
