import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { putTraceSegments, getServiceGraph, getTraceSummaries } from "../../utils/xray";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  if (body.type === "put") return json(await putTraceSegments(body.segments));
  return json({ error: "invalid type" }, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const start = new Date(url.searchParams.get("start") || "");
  const end = new Date(url.searchParams.get("end") || "");
  const mode = url.searchParams.get("mode");
  if (mode === "serviceGraph") return json(await getServiceGraph(start, end));
  return json(await getTraceSummaries(start, end, url.searchParams.get("filter") || undefined));
};
