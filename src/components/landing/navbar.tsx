"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { LanguageSelector } from "@/components/landing/language-selector";
import { Logo } from "@/components/landing/logo";
import { ServicesNavDropdown } from "@/components/landing/services-nav-dropdown";
import { useLocale } from "@/components/providers/locale-provider";
import { BookDemoButton } from "@/components/landing/book-demo-button";
import { getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { setLocationHash } from "@/lib/hash-navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { m, locale } = useLocale();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionLink = (hash: string) => (onHome ? hash : `/${hash}`);

  const links = [
    { href: sectionLink("#phone-receptionist"), label: m.nav.phoneLine },
    { href: sectionLink("#pricing"), label: m.nav.pricing },
    { href: sectionLink("#about"), label: m.nav.about },
    { href: sectionLink("#news"), label: m.nav.news },
  ];

  const contactHref = getContactHref(onHome);
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
          {links.slice(0, 1).map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-google-gray-700 transition-colors hover:text-google-blue"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ServicesNavDropdown sectionLink={sectionLink} onHome={onHome} />
          </li>
          {links.slice(1).map((link) => (
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
          <BookDemoButton variant="secondary" size="sm" analyticsLocation="navbar">
            {m.nav.ctaBookDemo}
          </BookDemoButton>
          <CtaButton href={contactHref} size="sm" analyticsLocation="navbar">
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
              {links.slice(0, 1).map((link) => (
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
              <li className="px-4 py-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-google-gray-400">
                  {m.nav.services}
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href={sectionLink("#voice-of-customer")}
                      className="block rounded-xl px-3 py-2.5 text-sm text-google-gray-700 hover:bg-google-gray-50"
                      onClick={(e) => {
                        setOpen(false);
                        if (onHome) {
                          e.preventDefault();
                          setLocationHash("#voice-of-customer");
                        }
                      }}
                    >
                      {m.nav.serviceVoc}
                    </a>
                  </li>
                  <li>
                    <a
                      href={sectionLink("#ai-receptionist")}
                      className="block rounded-xl px-3 py-2.5 text-sm text-google-gray-700 hover:bg-google-gray-50"
                      onClick={(e) => {
                        setOpen(false);
                        if (onHome) {
                          e.preventDefault();
                          setLocationHash("#ai-receptionist");
                        }
                      }}
                    >
                      {m.nav.serviceAi}
                    </a>
                  </li>
                </ul>
              </li>
              {links.slice(1).map((link) => (
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
                <BookDemoButton variant="secondary" analyticsLocation="navbar_mobile">
                  {m.nav.ctaBookDemo}
                </BookDemoButton>
                <CtaButton href={contactHref} analyticsLocation="navbar_mobile">
                  {talkCta}
                </CtaButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
