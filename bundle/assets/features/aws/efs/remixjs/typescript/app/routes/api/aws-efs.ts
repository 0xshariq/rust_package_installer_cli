import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listFileSystems, createFileSystem, deleteFileSystem, listMountTargets, createMountTarget, deleteMountTarget } from "../../utils/awsEfs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const fsId = url.searchParams.get("fileSystemId");
  if (fsId) return json(await listMountTargets(fsId));
  return json(await listFileSystems());
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  switch (body.type) {
    case "create-fs": return json(await createFileSystem(body.performanceMode, body.encrypted, body.tags));
    case "create-mt": return json(await createMountTarget(body.fileSystemId, body.subnetId, body.securityGroups));
    case "delete-fs": return json(await deleteFileSystem(body.fileSystemId));
    case "delete-mt": return json(await deleteMountTarget(body.mountTargetId));
    default: return json({ error: "invalid type" }, { status: 400 });
  }
};
