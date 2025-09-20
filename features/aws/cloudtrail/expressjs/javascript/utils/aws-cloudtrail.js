import { CloudTrailClient, DescribeTrailsCommand, LookupEventsCommand } from "@aws-sdk/client-cloudtrail";

const client = new CloudTrailClient({ region: process.env.AWS_REGION });

export const describeTrails = async () => {
  const command = new DescribeTrailsCommand({});
  return await client.send(command);
};

export const lookupEvents = async (StartTime, EndTime) => {
  const command = new LookupEventsCommand({ StartTime, EndTime });
  return await client.send(command);
};
