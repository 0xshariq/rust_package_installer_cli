import { NextResponse } from "next/server";
import { describeTrails, lookupEvents } from "@/lib/aws-cloudtrail";

export async function GET() {
  try {
    const trails = await describeTrails();
    return NextResponse.json(trails);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
