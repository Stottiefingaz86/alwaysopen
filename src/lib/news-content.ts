export type NewsCategory = "article" | "update";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  /** Anchor slug for in-page scroll or future `/news/[slug]` routes */
  slug: string;
  tags?: string[];
};

export const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "article",
    slug: "google-listing-phone-line",
    title: "Your Google listing phone line is your busiest storefront",
    excerpt:
      "Most local customers still call before they book online. If that number rings out, you're losing jobs to whoever answers first.",
    date: "2026-03-12",
    readTime: "4 min read",
    tags: ["Local SEO", "Phone"],
  },
  {
    id: "2",
    category: "article",
    slug: "bilingual-receptionist-costa-del-sol",
    title: "English and Spanish callers on one business number",
    excerpt:
      "On the Costa del Sol, mixed-language enquiries are normal. Here's how we train AlwaysOpen to handle both without awkward handoffs.",
    date: "2026-02-28",
    readTime: "5 min read",
    tags: ["Bilingual", "Setup"],
  },
  {
    id: "3",
    category: "update",
    slug: "voc-reports-march",
    title: "What's new in monthly VoC reports",
    excerpt:
      "Clearer action lists, competitor mention tracking, and review themes ranked by revenue impact — built from owner feedback in Manilva.",
    date: "2026-02-15",
    readTime: "3 min read",
    tags: ["Product"],
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
