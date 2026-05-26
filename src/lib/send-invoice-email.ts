import { COMPANY_EMAIL } from "@/lib/contact";
import { formatEuro } from "@/lib/backoffice/format";
import { sendResendEmail } from "@/lib/resend-send";

export type InvoiceEmailPayload = {
  clientName: string;
  contactName: string | null;
  contactEmail: string;
  amount: number;
  dueDate: string | null;
  packageName: string | null;
  invoiceUrl: string | null;
  setupFee: number | null;
  setupFeePaid: boolean;
  invoiceKind?: "monthly" | "setup";
};

function formatDueDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function sendInvoiceEmail(payload: InvoiceEmailPayload) {
  const greeting = payload.contactName?.trim()
    ? `Hi ${payload.contactName.trim()},`
    : "Hi,";

  const isSetup = payload.invoiceKind === "setup";
  const lineAmount = isSetup
    ? payload.setupFee != null
      ? formatEuro(payload.setupFee)
      : formatEuro(payload.amount)
    : formatEuro(payload.amount);

  const lineLabel = isSetup ? "One-time setup fee" : "Monthly subscription";
  const due = formatDueDate(payload.dueDate);

  const textLines = [
    greeting,
    "",
    `Please find your invoice from RingsAway for ${payload.clientName}.`,
    "",
    lineLabel + ": " + lineAmount,
    payload.packageName ? "Package: " + payload.packageName : null,
    due ? "Due date: " + due : null,
    "",
    payload.invoiceUrl
      ? "Pay or view your invoice online:\n" + payload.invoiceUrl
      : `Pay by bank transfer or reply to this email (${COMPANY_EMAIL}) and we will send payment details.`,
    "",
    "Questions? Reply to this email — we're happy to help.",
    "",
    "— RingsAway",
    COMPANY_EMAIL,
  ].filter((line): line is string => line != null);

  const html = `
    <p>${greeting}</p>
    <p>Please find your invoice from <strong>RingsAway</strong> for ${payload.clientName}.</p>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:4px 12px 4px 0;color:#5f6368">${lineLabel}</td><td style="padding:4px 0"><strong>${lineAmount}</strong></td></tr>
      ${payload.packageName ? `<tr><td style="padding:4px 12px 4px 0;color:#5f6368">Package</td><td style="padding:4px 0">${payload.packageName}</td></tr>` : ""}
      ${due ? `<tr><td style="padding:4px 12px 4px 0;color:#5f6368">Due date</td><td style="padding:4px 0">${due}</td></tr>` : ""}
    </table>
    ${
      payload.invoiceUrl
        ? `<p><a href="${payload.invoiceUrl}">View and pay invoice</a></p>`
        : `<p>Pay by bank transfer or reply to <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a> for payment details.</p>`
    }
    <p>Questions? Reply to this email.</p>
    <p>— RingsAway<br/><a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
  `.trim();

  const subject = isSetup
    ? `RingsAway setup invoice — ${payload.clientName}`
    : `RingsAway invoice — ${payload.clientName}`;

  return sendResendEmail({
    to: [payload.contactEmail],
    subject,
    text: textLines.join("\n"),
    html,
    replyTo: COMPANY_EMAIL,
  });
}
