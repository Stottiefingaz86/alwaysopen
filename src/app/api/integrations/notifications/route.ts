import { sendResendEmail } from "@/lib/resend-send";
import { NextResponse } from "next/server";

type NotificationBody = {
  type?: "booking_confirmation" | "cancellation";
  customer_name?: string;
  customer_email?: string;
  start?: string;
  end?: string;
  event_id?: string;
  business_name?: string;
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

  let body: NotificationBody;
  try {
    body = (await request.json()) as NotificationBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = body.customer_email?.trim();
  if (!to) {
    return NextResponse.json({ error: "customer_email is required" }, { status: 400 });
  }

  const name = body.customer_name?.trim() || "there";
  const business = body.business_name?.trim() || "your salon";
  const when = body.start ? new Date(body.start).toLocaleString("en-GB") : "your scheduled time";
  const ref = body.event_id ? ` Reference: ${body.event_id}.` : "";

  const isCancel = body.type === "cancellation";
  const subject = isCancel
    ? `Appointment cancelled — ${business}`
    : `Appointment confirmed — ${business}`;

  const text = isCancel
    ? `Hi ${name},\n\nYour appointment with ${business} has been cancelled.${ref}\n\nWe hope to see you again soon.`
    : `Hi ${name},\n\nYour appointment with ${business} is confirmed for ${when}.${ref}\n\nIf you need to change or cancel, please call us.`;

  const html = `<p>Hi ${name},</p><p>${text.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;

  try {
    await sendResendEmail({ to: [to], subject, text, html });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    channel: "email",
  });
}
