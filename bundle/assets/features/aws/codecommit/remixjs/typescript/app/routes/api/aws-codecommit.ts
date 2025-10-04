import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { listRepositories, getRepository, createRepository, deleteRepository } from "../../utils/awsCodeCommit";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get("repositoryName");
  if (name) return json(await getRepository(name));
  return json(await listRepositories());
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  switch (body.type) {
    case "create": return json(await createRepository(body.repositoryName, body.description));
    case "delete": return json(await deleteRepository(body.repositoryName));
    default: return json({ error: "invalid type" }, { status: 400 });
  }
};
