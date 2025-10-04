import { CloudWatchClient, DescribeAlarmsCommand, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const client = new CloudWatchClient({ region: process.env.AWS_REGION });

export const describeAlarms = async () => {
  const command = new DescribeAlarmsCommand({});
  return await client.send(command);
};

export const getMetricData = async (MetricDataQueries, StartTime, EndTime) => {
  const command = new GetMetricDataCommand({ MetricDataQueries, StartTime, EndTime });
  return await client.send(command);
};
