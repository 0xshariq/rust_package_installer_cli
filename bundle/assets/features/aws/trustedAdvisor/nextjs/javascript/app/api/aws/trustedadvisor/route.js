import { NextResponse } from "next/server";
import { describeChecks } from "@/lib/aws-trustedadvisor.js";

export async function GET() {
  try {
    const checks = await describeChecks();
    return NextResponse.json(checks);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
