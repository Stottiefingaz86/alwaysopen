import { requireAdminSession } from "@/lib/admin/require-admin";
import { getN8nWorkflowHealthOverview, syncN8nWorkflowHealthToDb } from "@/lib/n8n-api";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncN8nWorkflowHealthToDb();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const { rows, error } = await getN8nWorkflowHealthOverview();
  return NextResponse.json({
    ok: true,
    synced: result.synced,
    total: result.total,
    rows,
    error: error ?? null,
  });
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows, error } = await getN8nWorkflowHealthOverview();
  return NextResponse.json({ rows, error: error ?? null });
}
