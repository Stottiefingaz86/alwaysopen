export type NewsCategory = "article" | "update";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  /** Cover image in /public/news */
  image: string;
  imageAlt: string;
  tags?: string[];
  /** Full article body — paragraphs shown in the modal */
  body: string[];
};

export const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "article",
    slug: "google-listing-phone-line",
    image: "/news/google-post.jpg",
    imageAlt: "Google listing on a phone with an incoming call",
    title: "Your Google listing phone line is your busiest storefront",
    excerpt:
      "Most local customers still call before they book online. If that number rings out, you're losing jobs to whoever answers first.",
    date: "2026-03-12",
    readTime: "4 min read",
    tags: ["Local SEO", "Phone"],
    body: [
      "For most local businesses, the phone number on your Google listing gets more serious enquiries than your contact form. Someone ready to book a haircut, a dental check-up, or an emergency plumber does not want to wait until Monday morning.",
      "When that call goes to voicemail or rings out while you are with a client, they rarely leave a message. They call the next result on Google. That is not a branding problem; it is lost revenue you never see in your analytics.",
      "RingsAway answers on your existing business number, so the experience stays familiar for callers. They dial the same digits they already trust from your shop sign, website, or Maps listing.",
      "You still get summaries, bookings in your calendar, and confirmation emails. The difference is that your line is covered when you cannot physically pick up: evenings, weekends, and busy hours included.",
      "If you are investing in local SEO and Google reviews, treating your listed phone line as a first-class channel is the highest-leverage fix most owners skip.",
    ],
  },
  {
    id: "2",
    category: "article",
    slug: "bilingual-receptionist",
    image: "/news/bilingual-benefits.jpg",
    imageAlt: "English and Spanish callers on one business phone line",
    title: "English and Spanish callers on one business number",
    excerpt:
      "Mixed-language enquiries are common in many markets. Here's how we train RingsAway to handle both without awkward handoffs.",
    date: "2026-02-28",
    readTime: "5 min read",
    tags: ["Bilingual", "Setup"],
    body: [
      "Walk into many salons, clinics, and trade businesses in bilingual areas and you will hear both English and Spanish in the same afternoon. Your phone line should reflect that reality, not force callers to press 1 for a language they may not speak.",
      "We configure RingsAway with your preferred greeting, FAQs, and booking rules in both languages. The agent detects which language the caller uses and stays in that language for the rest of the conversation unless they switch.",
      "That matters for tone as much as comprehension. A nervous new patient or a holiday homeowner calling about a leak wants to feel understood, not routed through a generic script.",
      "During setup we capture how you actually speak to customers: your services, your hours, what you need before confirming a booking, and what counts as urgent. That knowledge lives in both languages from day one.",
      "Owners tell us the biggest relief is not translating everything themselves. It is knowing evening and weekend calls are handled properly whether the caller starts in English or Spanish.",
      "If you serve a mixed community, one bilingual receptionist on your real number is simpler than maintaining separate lines, chat widgets, and voicemail boxes nobody checks.",
    ],
  },
  {
    id: "3",
    category: "update",
    slug: "voc-reports-march",
    image: "/news/voc-news.webp",
    imageAlt: "Monthly customer feedback and VoC report",
    title: "What's new in monthly customer feedback reports",
    excerpt:
      "Clearer VoC explainers, action lists, competitor mentions, and Google Business guidance, all prepared by our team from owner feedback.",
    date: "2026-02-15",
    readTime: "3 min read",
    tags: ["Product"],
    body: [
      "Monthly customer feedback reports (Voice of the Customer, or VoC) are only useful if you open them and know what to do next, including on Google. This update is based on feedback from owners who wanted less jargon, less data, and more direction.",
      "When we prepare your report, action lists are ranked by likely impact: what to fix this month, what can wait, and what is already working from praise in your Google reviews.",
      "We also note when competitors are mentioned by name, so you can see why customers compare you and where you are already winning.",
      "Themes that repeat across multiple months are called out explicitly, so slow-burn problems (wait times, parking, pricing confusion) do not get buried under newer five-star comments.",
      "Reports stay short by design: a summary you can read in a few minutes, with optional detail if you want to dig into specific reviews, website feedback, or survey responses.",
      "Growth and Premium plans include these reports; if you are on Starter, ask us about upgrading when you are ready to turn reviews into a monthly habit rather than a guilty backlog.",
    ],
  },
];

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const categoryLabels: Record<NewsCategory, string> = {
  article: "Article",
  update: "Update",
};

export function getNewsItemBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug);
}
