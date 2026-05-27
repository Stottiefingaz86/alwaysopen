"use client";

import { LegalDocumentDialog } from "@/components/landing/legal-document-dialog";
import { Logo } from "@/components/landing/logo";
import { useLocale } from "@/components/providers/locale-provider";
import { BOOK_MEETING_EMAIL, getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import type { LegalDocumentKey } from "@/lib/i18n/legal-documents";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { useState } from "react";
import { SiInstagram } from "react-icons/si";

const INSTAGRAM_URL = "https://www.instagram.com/ringsaway_com/";

export function Footer() {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(true);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalKey, setLegalKey] = useState<LegalDocumentKey | null>(null);

  const openLegal = (key: LegalDocumentKey) => {
    setLegalKey(key);
    setLegalOpen(true);
  };

  const navLinks = [
    { href: "/admin/start", label: "Admin" },
    { href: "#services", label: m.nav.services },
    { href: "#pricing", label: m.nav.pricing },
    { href: "/news", label: m.nav.news },
    { href: "#phone-receptionist", label: m.nav.phoneLine },
    { href: "#about", label: m.nav.about },
    { href: "#faq", label: m.faq.eyebrow },
    { href: contactHref, label: getTalkOverCoffeeCta(locale) },
  ];

  const legalLinks: { key: LegalDocumentKey; label: string }[] = [
    { key: "privacy", label: m.footer.legalPrivacy },
    { key: "terms", label: m.footer.legalTerms },
    { key: "cookies", label: m.footer.legalCookies },
  ];

  return (
    <>
      <footer className="border-t border-google-gray-200 bg-google-gray-50">
        <div className="gradient-brand h-1 w-full" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-google-gray-500">
                {m.footer.description}
              </p>
              <p className="mt-3 text-sm text-google-gray-500">{m.footer.location}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${BOOK_MEETING_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-google-blue transition-colors hover:text-[var(--pastel-blue-hover)]"
                >
                  <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  {BOOK_MEETING_EMAIL}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-google-gray-200 bg-white text-google-gray-700 shadow-google transition-colors hover:border-google-blue/35 hover:bg-pastel-blue/40 hover:text-google-blue"
                  aria-label={m.footer.instagramLabel}
                >
                  <SiInstagram className="size-[1.125rem]" aria-hidden />
                </a>
              </div>
            </div>
            <nav>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-google-gray-700 transition-colors hover:text-google-blue"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-google-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
              <p className="text-sm text-google-gray-500">
                © {new Date().getFullYear()} RingsAway. {m.footer.copyright}
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.key}>
                    <button
                      type="button"
                      onClick={() => openLegal(link.key)}
                      className={cn(
                        "text-sm text-google-gray-600 underline-offset-2",
                        "transition-colors hover:text-google-blue hover:underline"
                      )}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-google-gray-500">{m.footer.tagline}</p>
          </div>
        </div>
      </footer>

      <LegalDocumentDialog
        documentKey={legalKey}
        open={legalOpen}
        onOpenChange={(open) => {
          setLegalOpen(open);
          if (!open) setLegalKey(null);
        }}
      />
    </>
  );
}
