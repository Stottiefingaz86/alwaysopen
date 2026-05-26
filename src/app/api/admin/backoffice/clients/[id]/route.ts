import { requireAdminSession } from "@/lib/admin/require-admin";
import { getBackofficeDb } from "@/lib/backoffice/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: {
    client?: Record<string, unknown>;
    integrations?: Record<string, unknown>;
    onboarding_checklist?: Record<string, boolean>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const db = getBackofficeDb();

  if (body.client) {
    const c = body.client;
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (c.business_name != null) patch.business_name = String(c.business_name);
    if (c.contact_name != null) patch.contact_name = String(c.contact_name) || null;
    if (c.contact_email != null) patch.contact_email = String(c.contact_email) || null;
    if (c.contact_phone != null) patch.contact_phone = String(c.contact_phone) || null;
    if (c.business_type != null) patch.business_type = String(c.business_type) || null;
    if (c.package_name != null) patch.package_name = String(c.package_name) || null;
    if (c.monthly_fee != null) patch.monthly_fee = Number(c.monthly_fee);
    if (c.setup_fee != null) patch.setup_fee = Number(c.setup_fee);
    if (c.included_minutes != null) patch.included_minutes = Number(c.included_minutes);
    if (c.overage_rate != null) patch.overage_rate = Number(c.overage_rate);
    if (c.status != null) patch.status = String(c.status);
    if (c.payment_status != null) patch.payment_status = String(c.payment_status) || null;
    if (c.notes != null) patch.notes = String(c.notes) || null;
    if (c.voc_enabled != null) patch.voc_enabled = Boolean(c.voc_enabled);
    if (body.onboarding_checklist) patch.onboarding_checklist = body.onboarding_checklist;

    const { error } = await db.from("clients").update(patch).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (body.onboarding_checklist) {
    await db
      .from("clients")
      .update({
        onboarding_checklist: body.onboarding_checklist,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  if (body.integrations) {
    const i = body.integrations;
    const integrationRow = {
      elevenlabs_agent_id: String(i.elevenlabs_agent_id ?? "").trim() || null,
      elevenlabs_agent_url: String(i.elevenlabs_agent_url ?? "").trim() || null,
      elevenlabs_phone_number_id: String(i.elevenlabs_phone_number_id ?? "").trim() || null,
      n8n_booking_workflow_url: String(i.n8n_booking_workflow_url ?? "").trim() || null,
      n8n_cancel_workflow_url: String(i.n8n_cancel_workflow_url ?? "").trim() || null,
      n8n_voc_workflow_url: String(i.n8n_voc_workflow_url ?? "").trim() || null,
      google_calendar_id: String(i.google_calendar_id ?? "").trim() || null,
      twilio_number: String(i.twilio_number ?? "").trim() || null,
      zadarma_number: String(i.zadarma_number ?? "").trim() || null,
      whatsapp_status: String(i.whatsapp_status ?? "").trim() || null,
      booking_platform: String(i.booking_platform ?? "").trim() || null,
      booking_platform_notes: String(i.booking_platform_notes ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await db
      .from("client_integrations")
      .select("id")
      .eq("client_id", id)
      .maybeSingle();

    if (existing) {
      await db.from("client_integrations").update(integrationRow).eq("client_id", id);
    } else {
      await db.from("client_integrations").insert({ client_id: id, ...integrationRow });
    }
  }

  return NextResponse.json({ ok: true });
}
