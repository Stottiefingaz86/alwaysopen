"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { LanguageSelector } from "@/components/landing/language-selector";
import { Logo } from "@/components/landing/logo";
import { useLocale } from "@/components/providers/locale-provider";
import { getBookingMailto, getTalkOverCoffeeCta } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { m, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "#phone-receptionist", label: m.nav.phoneLine },
    { href: "#services", label: m.nav.services },
    { href: "#pricing", label: m.nav.pricing },
    { href: "#about", label: m.nav.about },
    { href: "#news", label: m.nav.news },
  ];

  const mailto = getBookingMailto(locale);
  const talkCta = getTalkOverCoffeeCta(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 overflow-x-clip transition-shadow duration-300",
        scrolled
          ? "border-b border-google-gray-200/80 bg-background/95 shadow-google backdrop-blur-lg"
          : "border-b border-transparent bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="gradient-brand h-1 w-full" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo />
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-google-gray-700 transition-colors hover:text-google-blue"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <CtaButton href="#pricing" variant="secondary" size="sm">
            {m.nav.ctaPricing}
          </CtaButton>
          <CtaButton href={mailto} size="sm">
            {talkCta}
          </CtaButton>
          <LanguageSelector />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="rounded-xl p-2.5 text-google-gray-700 hover:bg-google-gray-50"
            onClick={() => setOpen(!open)}
            aria-label={open ? m.nav.closeMenu : m.nav.openMenu}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          <LanguageSelector />
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-google-gray-200/60 bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-google-gray-700 hover:bg-google-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="flex flex-col gap-2 border-t border-google-gray-100 pt-4">
                <CtaButton href="#pricing" variant="secondary">
                  {m.nav.ctaPricing}
                </CtaButton>
                <CtaButton href={mailto}>{talkCta}</CtaButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
