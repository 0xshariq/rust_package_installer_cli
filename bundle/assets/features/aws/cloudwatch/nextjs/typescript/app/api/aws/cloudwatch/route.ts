import { NextResponse } from "next/server";
import { describeAlarms } from "@/lib/aws-cloudwatch";

export async function GET() {
  try {
    const alarms = await describeAlarms();
    return NextResponse.json(alarms);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
