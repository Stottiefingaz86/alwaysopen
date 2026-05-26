import { requireAdminSession } from "@/lib/admin/require-admin";
import { getBackofficeDb, currentMonthKey } from "@/lib/backoffice/db";
import { DEFAULT_ONBOARDING } from "@/lib/backoffice/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const businessName = String(body.business_name ?? "").trim();
  if (!businessName) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  const db = getBackofficeDb();

  const { data: client, error } = await db
    .from("clients")
    .insert({
      business_name: businessName,
      contact_name: String(body.contact_name ?? "").trim() || null,
      contact_email: String(body.contact_email ?? "").trim() || null,
      contact_phone: String(body.contact_phone ?? "").trim() || null,
      business_type: String(body.business_type ?? "").trim() || null,
      package_name: String(body.package_name ?? "").trim() || null,
      monthly_fee: Number(body.monthly_fee ?? 0),
      setup_fee: Number(body.setup_fee ?? 0),
      included_minutes: Number(body.included_minutes ?? 0),
      overage_rate: Number(body.overage_rate ?? 0),
      status: String(body.status ?? "active"),
      payment_status: String(body.payment_status ?? "current"),
      notes: String(body.notes ?? "").trim() || null,
      voc_enabled: Boolean(body.voc_enabled),
      onboarding_checklist: DEFAULT_ONBOARDING,
    })
    .select("id")
    .single();

  if (error || !client) {
    return NextResponse.json({ error: error?.message ?? "Create failed" }, { status: 500 });
  }

  await db.from("client_integrations").insert({ client_id: client.id });

  const month = currentMonthKey();
  await db.from("usage_logs").insert({
    client_id: client.id,
    month,
    included_minutes: Number(body.included_minutes ?? 0),
    elevenlabs_minutes: 0,
  });

  return NextResponse.json({ id: client.id });
}
