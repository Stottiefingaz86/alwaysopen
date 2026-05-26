import { requireAdminSession } from "@/lib/admin/require-admin";
import { syncElevenLabsUsage } from "@/lib/elevenlabs-usage";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncElevenLabsUsage();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, synced: result.synced, results: result.results });
}
