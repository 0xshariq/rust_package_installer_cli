import { Injectable } from "@nestjs/common";
import { CloudWatchClient, DescribeAlarmsCommand, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const client = new CloudWatchClient({ region: process.env.AWS_REGION });

@Injectable()
export class AwsCloudWatchService {
  async describeAlarms() {
    const command = new DescribeAlarmsCommand({});
    return await client.send(command);
  }

  async getMetricData(MetricDataQueries: any[], StartTime: Date, EndTime: Date) {
    const command = new GetMetricDataCommand({ MetricDataQueries, StartTime, EndTime });
    return await client.send(command);
  }
}
