import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/gcs";

export async function DELETE(req: Request) {
  try {
    const { key } = await req.json();
    const data = await deleteFile(key);
    return NextResponse.json({ message: "Deleted", data });
  } catch (e) {
    return NextResponse.json({ error: "Delete failed", details: String(e) }, { status: 500 });
  }
}
