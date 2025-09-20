import { NextResponse } from "next/server";
import { listConfigRules, getComplianceDetails } from "@/lib/aws-config";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const rule = searchParams.get("rule");

  try {
    if (action === "rules") {
      const data = await listConfigRules();
      return NextResponse.json({ ok: true, data });
    }
    if (action === "compliance" && rule) {
      const data = await getComplianceDetails(rule);
      return NextResponse.json({ ok: true, data });
    }
    if (action === "allCompliance") {
      const data = await getComplianceDetails();
      return NextResponse.json({ ok: true, data });
    }
    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
