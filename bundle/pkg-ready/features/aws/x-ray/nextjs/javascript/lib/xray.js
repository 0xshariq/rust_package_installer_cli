import { XRayClient, PutTraceSegmentsCommand, GetServiceGraphCommand, GetTraceSummariesCommand } from "@aws-sdk/client-xray";

const client = new XRayClient({ region: process.env.AWS_REGION });

export function putTraceSegments(segments) {
  return client.send(new PutTraceSegmentsCommand({ TraceSegmentDocuments: segments }));
}

export function getServiceGraph(startTime, endTime) {
  return client.send(new GetServiceGraphCommand({ StartTime: startTime, EndTime: endTime }));
}

export function getTraceSummaries(startTime, endTime, filterExpression) {
  return client.send(new GetTraceSummariesCommand({ StartTime: startTime, EndTime: endTime, FilterExpression: filterExpression }));
}
