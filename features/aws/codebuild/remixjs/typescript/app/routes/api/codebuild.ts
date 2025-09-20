import { json } from "@remix-run/node";
import { listProjects, startBuild, batchGetBuilds, stopBuild } from "../../utils/codeBuild";

export const loader = async () => json(await listProjects());
export const action = async ({ request }) => {
  const body = await request.json();
  if (body.type === "start") return json(await startBuild(body.projectName, body.override));
  if (body.type === "batchGet") return json(await batchGetBuilds(body.ids));
  if (body.type === "stop") return json(await stopBuild(body.id, body.reason));
  return json({ error: "invalid type" }, { status: 400 });
};
