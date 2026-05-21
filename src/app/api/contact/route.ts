import { sendContactEmail } from "@/lib/send-contact-email";
import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  business?: string;
  phone?: string;
  message?: string;
  website?: string;
};

function trim(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (trim(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = trim(body.name, 120);
  const email = trim(body.email, 254);
  const business = trim(body.business, 160);
  const phone = trim(body.phone, 40);
  const message = trim(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await sendContactEmail({
      name,
      email,
      business: business || undefined,
      phone: phone || undefined,
      message,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 }
    );
  }
}
