import { NextResponse } from "next/server";
import {deletefile} from '@/lib/imagekit';

export async function DELETE(request) {
    try {
        const { fileId } = await request.json();
        const data = await deletefile(fileId);
        return NextResponse.json({ message: "Deleted successfully", data });
    } catch (err) {
        return NextResponse.json({ error: "Delete failed", details: err }, { status: 500 });
    }
}
