"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import { BOOK_MEETING_EMAIL, CONTACT_SECTION_ID } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";

const fieldClass = cn(
  "mt-1.5 w-full rounded-xl border border-google-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground",
  "outline-none transition-colors placeholder:text-google-gray-400",
  "focus-visible:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/20"
);

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const { m } = useLocale();
  const f = m.contactForm;
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          business: data.get("business"),
          phone: data.get("phone"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMessage(json.error ?? f.errorGeneric);
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setErrorMessage(f.errorGeneric);
      setState("error");
    }
  }

  return (
    <Section
      id={CONTACT_SECTION_ID}
      background="gray"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <SectionHeader
        compact
        eyebrow={f.eyebrow}
        title={f.title}
        subtitle={f.subtitle}
      />

      <FadeIn delay={0.04}>
        <p className="mx-auto mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-google-gray-600">
          <span>{f.emailReach}</span>
          <a
            href={`mailto:${BOOK_MEETING_EMAIL}`}
            className="inline-flex items-center gap-1.5 font-medium text-google-blue transition-colors hover:text-[var(--pastel-blue-hover)]"
          >
            <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {BOOK_MEETING_EMAIL}
          </a>
        </p>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mx-auto mt-6 max-w-3xl">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-google-gray-200 bg-white p-6 shadow-google-elevated sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                  {f.nameLabel}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  disabled={state === "sending"}
                  className={fieldClass}
                  placeholder={f.namePlaceholder}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                  {f.emailLabel}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={state === "sending"}
                  className={fieldClass}
                  placeholder={f.emailPlaceholder}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="contact-business" className="text-sm font-medium text-foreground">
                  {f.businessLabel}
                </label>
                <input
                  id="contact-business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  disabled={state === "sending"}
                  className={fieldClass}
                  placeholder={f.businessPlaceholder}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
                  {f.phoneLabel}
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={state === "sending"}
                  className={fieldClass}
                  placeholder={f.phonePlaceholder}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                  {f.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  disabled={state === "sending"}
                  className={cn(fieldClass, "resize-y min-h-[8rem]")}
                  placeholder={f.messagePlaceholder}
                />
              </div>
            </div>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="pointer-events-none absolute size-0 opacity-0"
              aria-hidden
            />

            {state === "success" ? (
              <p
                role="status"
                className="mt-6 rounded-xl border border-google-green/25 bg-google-green/5 px-4 py-3 text-sm text-google-green"
              >
                {f.success}
              </p>
            ) : null}

            {state === "error" && errorMessage ? (
              <p
                role="alert"
                className="mt-6 rounded-xl border border-google-red/25 bg-google-red/5 px-4 py-3 text-sm text-google-red"
              >
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-google-gray-500">{f.privacy}</p>
              <Button
                type="submit"
                disabled={state === "sending"}
                className="h-11 min-w-[10rem] rounded-xl bg-[var(--pastel-blue-deep)] px-6 text-[15px] font-medium text-white hover:bg-[var(--pastel-blue-hover)]"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {f.sending}
                  </>
                ) : (
                  f.submit
                )}
              </Button>
            </div>
          </form>
        </div>
      </FadeIn>
    </Section>
  );
}
