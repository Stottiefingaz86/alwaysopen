import { currentMonthKey, getBackofficeDb } from "@/lib/backoffice/db";
import { NextResponse } from "next/server";

type WorkflowLogBody = {
  client_id?: string;
  workflow_name?: string;
  workflow_type?: string;
  status?: string;
  error_message?: string | null;
  booking_created?: boolean;
  sms_sent?: boolean;
  email_sent?: boolean;
};

export async function POST(request: Request) {
  const secret = process.env.WORKFLOW_LOG_SECRET?.trim();
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: WorkflowLogBody;
  try {
    body = (await request.json()) as WorkflowLogBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.client_id?.trim();
  const workflowName = body.workflow_name?.trim();
  if (!clientId || !workflowName) {
    return NextResponse.json({ error: "client_id and workflow_name required" }, { status: 400 });
  }

  const status = body.status?.trim() ?? "unknown";
  const health =
    status === "success" || status === "ok" ? "healthy" : status === "failed" ? "failed" : "warning";

  const db = getBackofficeDb();
  const now = new Date().toISOString();

  const row = {
    client_id: clientId,
    workflow_name: workflowName,
    workflow_type: body.workflow_type ?? null,
    last_run: now,
    status,
    error_message: body.error_message ?? null,
    health_status: health,
    updated_at: now,
  };

  const { data: existing } = await db
    .from("workflow_health")
    .select("id")
    .eq("client_id", clientId)
    .eq("workflow_name", workflowName)
    .maybeSingle();

  if (existing?.id) {
    await db.from("workflow_health").update(row).eq("id", existing.id);
  } else {
    await db.from("workflow_health").insert(row);
  }

  const month = currentMonthKey();
  const { data: usage } = await db
    .from("usage_logs")
    .select("*")
    .eq("client_id", clientId)
    .eq("month", month)
    .maybeSingle();

  if (usage) {
    await db
      .from("usage_logs")
      .update({
        sms_sent: (usage.sms_sent ?? 0) + (body.sms_sent ? 1 : 0),
        emails_sent: (usage.emails_sent ?? 0) + (body.email_sent ? 1 : 0),
        bookings_created: (usage.bookings_created ?? 0) + (body.booking_created ? 1 : 0),
        failed_workflows:
          (usage.failed_workflows ?? 0) + (status === "failed" ? 1 : 0),
      })
      .eq("id", usage.id);
  }

  if (body.booking_created) {
    await db.from("client_bookings").insert({
      client_id: clientId,
      booking_type: body.workflow_type ?? "booking",
      status: "confirmed",
    });
  }

  return NextResponse.json({ ok: true });
}
