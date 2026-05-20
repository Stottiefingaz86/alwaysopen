export const BOOK_MEETING_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ringsaway.com";

const subject = "Book a meeting - RingsAway";
const body = [
  "Hi,",
  "",
  "I'd like to book a meeting to learn more about RingsAway.",
  "",
  "Name:",
  "Business:",
  "Phone:",
  "",
  "Thanks,",
].join("\n");

export const BOOK_MEETING_MAILTO = `mailto:${BOOK_MEETING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
