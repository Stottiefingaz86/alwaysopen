import { requireAdminSession } from "@/lib/admin/require-admin";
import { getN8nConfig, listN8nWorkflows } from "@/lib/n8n-api";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { configured, base } = getN8nConfig();
  const { workflows, error } = await listN8nWorkflows();

  return NextResponse.json({
    configured,
    instanceUrl: base ?? null,
    workflows,
    error: error ?? null,
  });
}
