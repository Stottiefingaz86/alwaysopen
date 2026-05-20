import { en } from "@/lib/i18n/messages/en";
import { es } from "@/lib/i18n/messages/es";
import type { Locale } from "@/lib/i18n/types";

export type NewsCategory = "article" | "update";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  image: string;
  imageAlt: string;
  tags?: string[];
  body: string[];
};

const NEWS_META = [
  {
    slug: "google-listing-phone-line",
    image: "/news/google-post.jpg",
    date: "2026-03-12",
  },
  {
    slug: "bilingual-receptionist",
    image: "/news/bilingual-benefits.jpg",
    date: "2026-02-28",
  },
  {
    slug: "voc-reports-march",
    image: "/news/voc-news.webp",
    date: "2026-02-15",
  },
] as const;

function buildNewsItems(locale: Locale): NewsItem[] {
  const items = locale === "es" ? es.news.items : en.news.items;

  return items.map((item, index) => {
    const meta = NEWS_META.find((m) => m.slug === item.slug)!;
    return {
      id: String(index + 1),
      category: item.category,
      title: item.title,
      excerpt: item.excerpt,
      date: meta.date,
      readTime: item.readTime,
      slug: item.slug,
      image: meta.image,
      imageAlt: item.imageAlt,
      tags: item.tags ? [...item.tags] : undefined,
      body: [...item.body],
    };
  });
}

/** @deprecated Use getNewsItems(locale) */
export const newsItems = buildNewsItems("en");

/** @deprecated Use getCategoryLabel(category, locale) */
export const categoryLabels: Record<NewsCategory, string> = {
  article: en.news.categoryArticle,
  update: en.news.categoryUpdate,
};

export function getNewsItems(locale: Locale = "en"): NewsItem[] {
  return buildNewsItems(locale);
}

export function formatNewsDate(iso: string, locale: Locale = "en"): string {
  return new Date(iso).toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getCategoryLabel(category: NewsCategory, locale: Locale = "en") {
  const m = locale === "es" ? es.news : en.news;
  return category === "article" ? m.categoryArticle : m.categoryUpdate;
}

export function getNewsItemBySlug(slug: string, locale: Locale = "en"): NewsItem | undefined {
  return getNewsItems(locale).find((item) => item.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return NEWS_META.map((m) => m.slug);
}
