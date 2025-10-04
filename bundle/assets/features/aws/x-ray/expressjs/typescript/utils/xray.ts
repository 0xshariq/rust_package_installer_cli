import { XRayClient, PutTraceSegmentsCommand, GetServiceGraphCommand, GetTraceSummariesCommand, ListGroupsCommand, ListTraceSummariesCommand } from "@aws-sdk/client-xray";

const client = new XRayClient({ region: process.env.AWS_REGION });

export function putTraceSegments(segments: string[]) {
  return client.send(new PutTraceSegmentsCommand({ TraceSegmentDocuments: segments }));
}

export function getServiceGraph(startTime: Date, endTime: Date) {
  return client.send(new GetServiceGraphCommand({ StartTime: startTime, EndTime: endTime }));
}

export function getTraceSummaries(startTime: Date, endTime: Date, filterExpression?: string) {
  return client.send(new GetTraceSummariesCommand({ StartTime: startTime, EndTime: endTime, FilterExpression: filterExpression }));
}

export function listGroups() {
  return client.send(new ListGroupsCommand({}));
}

export function listTraceSummaries(startTime: Date, endTime: Date, filterExpression?: string) {
  return client.send(new ListTraceSummariesCommand({ StartTime: startTime, EndTime: endTime, FilterExpression: filterExpression }));
}
