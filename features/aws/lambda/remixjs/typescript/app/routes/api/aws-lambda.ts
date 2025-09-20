import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listFunctions, invokeFunction } from "../../utils/awsLambda";

export const loader: LoaderFunction = async () => {
  const data = await listFunctions();
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const { functionName, payload, invocationType } = await request.json();
  const data = await invokeFunction(functionName, payload, invocationType);
  return json(data);
};
