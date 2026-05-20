export const BOOK_MEETING_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "christopher.hunt86@gmail.com";

export const TALK_OVER_COFFEE_CTA = "Talk Over Coffee ☕";
export const TALK_OVER_COFFEE_LINK = "Talk over coffee ☕";

const subject = "Talk over coffee - RingsAway";
const body = [
  "Hi,",
  "",
  "I'd love to talk over coffee and learn more about RingsAway.",
  "",
  "Name:",
  "Business:",
  "Phone:",
  "",
  "Thanks,",
].join("\n");

export const BOOK_MEETING_MAILTO = `mailto:${BOOK_MEETING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
