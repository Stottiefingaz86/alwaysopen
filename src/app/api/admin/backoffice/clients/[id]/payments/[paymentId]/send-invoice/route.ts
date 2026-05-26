import { requireAdminSession } from "@/lib/admin/require-admin";
import { getBackofficeDb } from "@/lib/backoffice/db";
import { sendInvoiceEmail } from "@/lib/send-invoice-email";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const session = await requireAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: clientId, paymentId } = await params;

  let body: { kind?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* optional body */
  }

  const db = getBackofficeDb();

  const { data: client, error: clientError } = await db
    .from("clients")
    .select(
      "id, business_name, contact_name, contact_email, package_name, setup_fee, monthly_fee, payment_status"
    )
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const toEmail = client.contact_email?.trim();
  if (!toEmail) {
    return NextResponse.json(
      { error: "Add a contact email on the client Overview before sending an invoice." },
      { status: 400 }
    );
  }

  const { data: payment, error: paymentError } = await db
    .from("client_payments")
    .select("*")
    .eq("id", paymentId)
    .eq("client_id", clientId)
    .single();

  if (paymentError || !payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  const kind = body.kind === "setup" ? "setup" : "monthly";
  const amount =
    kind === "setup"
      ? Number(client.setup_fee ?? payment.amount ?? 0)
      : Number(payment.amount ?? client.monthly_fee ?? 0);

  if (amount <= 0) {
    return NextResponse.json({ error: "Invoice amount must be greater than zero." }, { status: 400 });
  }

  try {
    const { from } = await sendInvoiceEmail({
      clientName: client.business_name,
      contactName: client.contact_name,
      contactEmail: toEmail,
      amount,
      dueDate: payment.due_date,
      packageName: client.package_name,
      invoiceUrl: payment.invoice_url,
      setupFee: Number(client.setup_fee ?? 0),
      setupFeePaid: payment.setup_fee_paid,
      invoiceKind: kind,
    });

    await db
      .from("client_payments")
      .update({
        status: payment.status === "paid" ? "paid" : "sent",
        amount: kind === "setup" ? Number(client.setup_fee ?? amount) : amount,
        invoice_sent_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (payment.status !== "paid" && client.payment_status !== "paid") {
      await db
        .from("clients")
        .update({ payment_status: "unpaid", updated_at: new Date().toISOString() })
        .eq("id", clientId);
    }

    return NextResponse.json({ ok: true, sentTo: toEmail, from });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
