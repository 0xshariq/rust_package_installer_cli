import { NextResponse } from "next/server";
import { listAccounts, describeOrganization } from "@/lib/aws/organizations";

export async function GET() {
  try {
    const data = await listAccounts();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await describeOrganization();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}