import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listPipelines, getPipeline, startPipelineExecution, getPipelineExecution } from "../../utils/codePipeline";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const execId = url.searchParams.get("executionId");

  if (name && execId) return json(await getPipelineExecution(name, execId));
  if (name) return json(await getPipeline(name));
  return json(await listPipelines());
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  if (body.type === "start") return json(await startPipelineExecution(body.name));
  return json({ error: "invalid type" }, { status: 400 });
};
