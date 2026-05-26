import { LEADS_TO_EMAIL } from "@/lib/contact";

export type ContactFormPayload = {
  name: string;
  email: string;
  business?: string;
  phone?: string;
  message: string;
};

/** Resend test mode only delivers to the account owner until a domain is verified */
const LEADS_TO_EMAIL_FALLBACK =
  process.env.LEADS_TO_EMAIL_FALLBACK ?? "stottiefingaz@gmail.com";

const SAFE_FROM = "onboarding@resend.dev";

function getConfiguredFrom(): string {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return SAFE_FROM;
  if (configured.includes("<")) return configured;
  return `RingsAway <${configured}>`;
}

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

type ResendErrorInfo = {
  message: string;
  status?: number;
  isDomainError: boolean;
  isRecipientError: boolean;
};

function parseResendError(status: number, body: string): ResendErrorInfo {
  let message = body || `Resend error ${status}`;
  try {
    const json = JSON.parse(body) as { message?: string };
    if (json.message) message = json.message;
  } catch {
    /* plain text body */
  }

  const lower = message.toLowerCase();
  return {
    message,
    status,
    isDomainError:
      status === 403 &&
      (lower.includes("domain is not verified") || lower.includes("verify your domain")),
    isRecipientError:
      lower.includes("only send testing emails") ||
      lower.includes("verify a domain") ||
      (status === 403 && lower.includes("testing")),
  };
}

async function postToResend(
  apiKey: string,
  from: string,
  to: string[],
  payload: ContactFormPayload,
  note?: string
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `RingsAway contact: ${payload.name}`,
      text: buildBody(payload, note),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const info = parseResendError(res.status, detail);
    const err = new Error(info.message);
    Object.assign(err, info);
    throw err;
  }
}

export async function sendContactEmail(payload: ContactFormPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const configuredFrom = getConfiguredFrom();
  const fromAddresses =
    configuredFrom === SAFE_FROM || configuredFrom.includes(SAFE_FROM)
      ? [configuredFrom]
      : [configuredFrom, SAFE_FROM];

  let lastError: Error | null = null;

  for (const from of fromAddresses) {
    try {
      await postToResend(apiKey, from, [LEADS_TO_EMAIL], payload);
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const info = err as Error & ResendErrorInfo;

      if (info.isRecipientError && LEADS_TO_EMAIL_FALLBACK !== LEADS_TO_EMAIL) {
        await postToResend(
          apiKey,
          from,
          [LEADS_TO_EMAIL_FALLBACK],
          payload,
          `Intended inbox: ${LEADS_TO_EMAIL} (Resend test mode — verify ringsaway.com to deliver there directly).`
        );
        return;
      }

      if (!info.isDomainError && !info.isRecipientError) {
        throw lastError;
      }
    }
  }

  if (lastError) throw lastError;
}
