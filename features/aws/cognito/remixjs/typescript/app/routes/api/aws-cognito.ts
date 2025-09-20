import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { signUpUser, signInUser, adminCreateUser, listUsers, adminDeleteUser } from "../../utils/awsCognito";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const userPoolId = url.searchParams.get("userPoolId")!;
  const data = await listUsers(userPoolId);
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const { type, payload } = await request.json();
  switch (type) {
    case "signup": return json(await signUpUser(payload.clientId, payload.username, payload.password, payload.email));
    case "signin": return json(await signInUser(payload.clientId, payload.username, payload.password));
    case "adminCreate": return json(await adminCreateUser(payload.userPoolId, payload.username, payload.temporaryPassword, payload.email));
    case "delete": return json(await adminDeleteUser(payload.userPoolId, payload.username));
    default: return json({ error: "invalid type" }, { status: 400 });
  }
};
