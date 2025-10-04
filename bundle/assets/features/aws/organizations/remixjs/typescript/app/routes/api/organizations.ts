
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { orgListAccounts,orgDescribe  } from "../../utils/aws-organizations";

export const loader: LoaderFunction = async () => {
  try {
    const data = await orgListAccounts();
    return json({ ok: true, data });
  } catch (err: any) {
    return json({ ok: false, error: err.message ?? "Unknown error" }, { status: 500 });
  }
};

export const loader: LoaderFunction = async () => {
  try {
    const data = await orgDescribe();
    return json({ ok: true, data });
  } catch (err: any) {
    return json({ ok: false, error: err.message ?? "Unknown error" }, { status: 500 });
  }
};