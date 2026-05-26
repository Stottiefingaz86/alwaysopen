"use client";

import { Logo } from "@/components/landing/logo";
import { useLocale } from "@/components/providers/locale-provider";
import { BOOK_MEETING_EMAIL, getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import { Mail } from "lucide-react";

export function Footer() {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(true);

  const links = [
    { href: "/admin/start", label: "Admin" },
    { href: "#services", label: m.nav.services },
    { href: "#pricing", label: m.nav.pricing },
    { href: "/news", label: m.nav.news },
    { href: "#phone-receptionist", label: m.nav.phoneLine },
    { href: "#about", label: m.nav.about },
    { href: "#faq", label: m.faq.eyebrow },
    { href: contactHref, label: getTalkOverCoffeeCta(locale) },
  ];

  return (
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
            <a
              href={`mailto:${BOOK_MEETING_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-google-blue transition-colors hover:text-[var(--pastel-blue-hover)]"
            >
              <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {BOOK_MEETING_EMAIL}
            </a>
          </div>
          <nav>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {links.map((link) => (
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
        <div className="mt-10 flex flex-col gap-2 border-t border-google-gray-200 pt-8 text-sm text-google-gray-500 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} RingsAway. {m.footer.copyright}
          </p>
          <p>{m.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
