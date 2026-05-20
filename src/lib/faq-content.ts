export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "item-1",
    question: "Does it use my existing business number?",
    answer:
      "Yes. Customers dial the same number they already use on Google, your website, or shop signage. RingsAway answers that line; it's not a separate app or chat widget.",
  },
  {
    id: "item-2",
    question: "Is it really available 24/7?",
    answer:
      "Your AI receptionist answers whenever you can't: evenings, weekends, and busy periods. You choose when to hand off to a person.",
  },
  {
    id: "item-3",
    question: "How do bookings reach my calendar?",
    answer:
      "Confirmed appointments sync to Google Calendar (and more on higher plans). You and your team get email confirmations with caller details.",
  },
  {
    id: "item-4",
    question: "What is Voice of the Customer (VoC)?",
    answer:
      "VoC means listening to what customers actually say in Google reviews, on your website, in surveys, and after visits, then turning that into insight you can use. Star ratings alone do not tell you whether to fix wait times, staff training, pricing, or your Google listing. A good VoC report answers: what are people saying, why does it matter for my business, and what should I do this month?",
  },
  {
    id: "item-5",
    question: "What is in the monthly report and Google Business plan?",
    answer:
      "Our team prepares this by hand each month. We read your Google Business reviews, website feedback, surveys, and satisfaction notes, then send themes, competitor mentions, review reply ideas, a ranked action plan, and practical Google Business guidance (what to post, what to reply to, how to show up better locally). This is not AI-generated analysis.",
  },
  {
    id: "item-6",
    question: "Who is RingsAway for?",
    answer:
      "Phone-first local businesses: salons, clinics, trades, shops, and practices that lose enquiries when no one picks up. We're based in Manilva, Spain, and work with owners in English and Spanish. You don't need to be on the Costa del Sol.",
  },
];
