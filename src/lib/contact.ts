import type { Locale } from "@/lib/i18n/types";
import { en } from "@/lib/i18n/messages/en";
import { es } from "@/lib/i18n/messages/es";

export const BOOK_MEETING_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "christopher.hunt86@gmail.com";

export const LEADS_TO_EMAIL =
  process.env.LEADS_TO_EMAIL ?? "christopher.hunt86@gmail.com";

export const CONTACT_SECTION_ID = "contact";

/** In-page contact form anchor (home vs other routes). */
export function getContactHref(onHome = true) {
  return onHome ? `#${CONTACT_SECTION_ID}` : `/#${CONTACT_SECTION_ID}`;
}

/** Demo line to speak with the RingsAway AI agent by phone */
export const AI_AGENT_PHONE_DISPLAY = "+34 919 93 52 38";
export const AI_AGENT_PHONE_TEL = "+34919935238";

const mailCopy = { en, es } as const;

export function getTalkOverCoffeeCta(locale: Locale = "en") {
  return mailCopy[locale].contact.talkCoffee;
}

export function getTalkOverCoffeeLink(locale: Locale = "en") {
  return mailCopy[locale].contact.talkCoffeeLink;
}

/** @deprecated Use getTalkOverCoffeeCta(locale) in client components */
export const TALK_OVER_COFFEE_CTA = en.contact.talkCoffee;
/** @deprecated Use getTalkOverCoffeeLink(locale) */
export const TALK_OVER_COFFEE_LINK = en.contact.talkCoffeeLink;

export function getBookingMailto(locale: Locale = "en") {
  const c = mailCopy[locale].contact;
  const body = [
    c.mailGreeting,
    "",
    c.mailBodyIntro,
    "",
    c.mailName,
    c.mailBusiness,
    c.mailPhone,
    "",
    c.mailThanks,
  ].join("\n");

  return `mailto:${BOOK_MEETING_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(body)}`;
}

/** @deprecated Use getBookingMailto(locale) */
export const BOOK_MEETING_MAILTO = getBookingMailto("en");
