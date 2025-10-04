import { Injectable } from "@nestjs/common";
import { XRayClient, PutTraceSegmentsCommand, GetServiceGraphCommand, GetTraceSummariesCommand } from "@aws-sdk/client-xray";

@Injectable()
export class XRayService {
  private client = new XRayClient({ region: process.env.AWS_REGION });

  putTraceSegments(segments: string[]) {
    // segments: array of JSON strings
    return this.client.send(new PutTraceSegmentsCommand({ TraceSegmentDocuments: segments }));
  }

  getServiceGraph(startTime: Date, endTime: Date) {
    return this.client.send(new GetServiceGraphCommand({ StartTime: startTime, EndTime: endTime }));
  }

  getTraceSummaries(startTime: Date, endTime: Date, filterExpression?: string) {
    return this.client.send(new GetTraceSummariesCommand({ StartTime: startTime, EndTime: endTime, FilterExpression: filterExpression }));
  }
}
