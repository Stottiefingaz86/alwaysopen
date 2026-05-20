export const BOOK_MEETING_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@alwaysopen.ie";

const subject = "Book a meeting — AlwaysOpen";
const body = [
  "Hi,",
  "",
  "I'd like to book a meeting to learn more about AlwaysOpen.",
  "",
  "Name:",
  "Business:",
  "Phone:",
  "",
  "Thanks,",
].join("\n");

export const BOOK_MEETING_MAILTO = `mailto:${BOOK_MEETING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
