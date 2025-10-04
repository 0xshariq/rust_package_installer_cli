import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listVolumes, createVolume, deleteVolume, attachVolume, detachVolume } from "../../utils/awsEbs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const az = url.searchParams.get("az") || undefined;
  const data = await listVolumes(az ? { "availability-zone": az } : undefined);
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  switch (body.type) {
    case "create": return json(await createVolume(body.az, body.sizeGiB, body.volumeType, body.tagKey, body.tagValue));
    case "attach": return json(await attachVolume(body.volumeId, body.instanceId, body.device));
    case "detach": return json(await detachVolume(body.volumeId, body.instanceId, body.device, body.force));
    case "delete": return json(await deleteVolume(body.volumeId));
    default: return json({ error: "invalid type" }, { status: 400 });
  }
};
