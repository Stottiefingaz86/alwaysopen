import { sendResendEmail } from "@/lib/resend-send";
import { getBackofficeDb } from "@/lib/backoffice/db";
import { NextResponse } from "next/server";

type MarketingBody = {
  action?: "send_follow_up" | "schedule";
  client_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  event_id?: string;
  campaign?: string;
  booking_start?: string;
};

function authorize(request: Request): boolean {
  const secret = process.env.WORKFLOW_LOG_SECRET?.trim();
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: MarketingBody;
  try {
    body = (await request.json()) as MarketingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action !== "send_follow_up") {
    return NextResponse.json({ error: "action must be send_follow_up" }, { status: 400 });
  }

  const clientId = body.client_id?.trim();
  if (!clientId) {
    return NextResponse.json({ error: "client_id is required" }, { status: 400 });
  }

  const db = getBackofficeDb();
  const { data: client } = await db
    .from("clients")
    .select("business_name, contact_email")
    .eq("id", clientId)
    .maybeSingle();

  const business = client?.business_name?.trim() || "your salon";
  const name = body.customer_name?.trim() || "there";
  const campaign = body.campaign?.trim() || "30_day_rebook";

  const to = body.customer_email?.trim();
  if (!to) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "no_customer_email",
      campaign,
      message: "Marketing follow-up skipped — no email on file. Collect email in the voice flow for email campaigns.",
    });
  }

  const subject = `We'd love to see you again — ${business}`;
  const text = [
    `Hi ${name},`,
    "",
    `It's been about a month since your last visit at ${business}.`,
    "Would you like to book your next appointment? Reply to this email or call us — we're happy to find a time that works.",
    "",
    body.event_id ? `Your previous booking reference: ${body.event_id}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = text.replace(/\n/g, "<br>");

  try {
    await sendResendEmail({ to: [to], subject, text, html });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    campaign,
    channel: "email",
    client_id: clientId,
  });
}
