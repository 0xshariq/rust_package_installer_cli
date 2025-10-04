import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listConfigRules, getComplianceDetails } from "../../utils/aws-config";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const rule = url.searchParams.get("rule");

  try {
    if (action === "rules") {
      const data = await listConfigRules();
      return json({ ok: true, data });
    }
    if (action === "compliance" && rule) {
      const data = await getComplianceDetails(rule);
      return json({ ok: true, data });
    }
    return json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return json({ ok: false, error: err.message }, { status: 500 });
  }
};
