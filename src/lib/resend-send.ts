import { COMPANY_EMAIL } from "@/lib/contact";

const SAFE_FROM = "onboarding@resend.dev";
const PREFERRED_FROM = `RingsAway <${COMPANY_EMAIL}>`;

type ResendErrorInfo = {
  message: string;
  status?: number;
  isDomainError: boolean;
};

function parseResendError(status: number, body: string): ResendErrorInfo {
  let message = body || `Resend error ${status}`;
  try {
    const json = JSON.parse(body) as { message?: string };
    if (json.message) message = json.message;
  } catch {
    /* plain text */
  }
  const lower = message.toLowerCase();
  return {
    message,
    status,
    isDomainError:
      status === 403 &&
      (lower.includes("domain is not verified") || lower.includes("verify your domain")),
  };
}

function normalizeFrom(value: string) {
  if (value.includes("<")) return value;
  return `RingsAway <${value}>`;
}

/** From addresses to try: hello@ringsaway.com first, then env override, then Resend sandbox. */
export function getResendFromCandidates() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  const candidates = [PREFERRED_FROM];
  if (configured) {
    const normalized = normalizeFrom(configured);
    if (!candidates.includes(normalized)) candidates.push(normalized);
  }
  if (!candidates.includes(SAFE_FROM)) candidates.push(SAFE_FROM);
  return candidates;
}

export async function sendResendEmail(input: {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const replyTo = input.replyTo ?? COMPANY_EMAIL;
  let lastError: Error | null = null;

  for (const from of getResendFromCandidates()) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        reply_to: replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });

    if (res.ok) return { from };

    const detail = await res.text().catch(() => "");
    const info = parseResendError(res.status, detail);
    lastError = new Error(info.message);
    if (!info.isDomainError) throw lastError;
  }

  if (lastError) throw lastError;
  throw new Error("Could not send email");
}
