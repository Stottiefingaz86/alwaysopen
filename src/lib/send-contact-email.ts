export type ContactFormPayload = {
  name: string;
  email: string;
  business?: string;
  phone?: string;
  message: string;
};

const LEADS_TO_EMAIL =
  process.env.LEADS_TO_EMAIL ?? "christopher.hunt86@gmail.com";

/** Resend test mode only delivers to the account owner until a domain is verified */
const LEADS_TO_EMAIL_FALLBACK =
  process.env.LEADS_TO_EMAIL_FALLBACK ?? "stottiefingaz@gmail.com";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "RingsAway <onboarding@resend.dev>";

function buildBody(payload: ContactFormPayload, note?: string) {
  const lines = [
    note,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.business ? `Business: ${payload.business}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    "",
    payload.message,
  ].filter((line): line is string => line != null && line !== "");

  return lines.join("\n");
}

function isResendRecipientRestriction(detail: string) {
  return (
    detail.includes("only send testing emails") ||
    detail.includes("verify a domain")
  );
}

async function postToResend(
  apiKey: string,
  to: string[],
  payload: ContactFormPayload,
  note?: string
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      reply_to: payload.email,
      subject: `RingsAway contact: ${payload.name}`,
      text: buildBody(payload, note),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(detail || `Resend error ${res.status}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
}

export async function sendContactEmail(payload: ContactFormPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  try {
    await postToResend(apiKey, [LEADS_TO_EMAIL], payload);
    return;
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    const canFallback =
      LEADS_TO_EMAIL_FALLBACK &&
      LEADS_TO_EMAIL_FALLBACK !== LEADS_TO_EMAIL &&
      isResendRecipientRestriction(detail);

    if (!canFallback) throw err;

    await postToResend(
      apiKey,
      [LEADS_TO_EMAIL_FALLBACK],
      payload,
      `Intended inbox: ${LEADS_TO_EMAIL} (Resend test mode — verify a domain to deliver there directly).`
    );
  }
}
