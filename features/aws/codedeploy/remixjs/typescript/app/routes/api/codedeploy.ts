import { json } from "@remix-run/node";
import { listApplications, createDeployment, getDeployment, stopDeployment } from "../../utils/codeDeploy";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("deploymentId");
  if (id) return json(await getDeployment(id));
  return json(await listApplications());
};

export const action = async ({ request }) => {
  const body = await request.json();
  if (body.type === "create") return json(await createDeployment(body.params));
  if (body.type === "stop") return json(await stopDeployment(body.deploymentId));
  return json({ error: "invalid type" }, { status: 400 });
};
