import { getBackofficeDb } from "@/lib/backoffice/db";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: clientId } = await params;
  const db = getBackofficeDb();
  const month = new Date().toISOString().slice(0, 7);
  const token = randomBytes(16).toString("hex");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ringsaway.com";
  const publicUrl = `${siteUrl}/reports/placeholder/${month}?token=${token}`;

  const { error } = await db.from("client_voc_reports").insert({
    client_id: clientId,
    month,
    public_token: token,
    public_url: publicUrl,
    status: "draft",
    report_json: {
      placeholder: true,
      generated_at: new Date().toISOString(),
      note: "Replace with real VoC pipeline when connected.",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, public_url: publicUrl });
}
