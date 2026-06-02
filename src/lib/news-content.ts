import { en } from "@/lib/i18n/messages/en";
import { es } from "@/lib/i18n/messages/es";
import type { Locale } from "@/lib/i18n/types";
import { getNewsBlocks } from "@/lib/news-articles";

export type NewsCategory = "article" | "update";

export type NewsTextSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export type NewsStatGridIcon = "intent" | "phone" | "growth" | "loss";

export type NewsBodyBlock =
  | { type: "paragraph"; segments: NewsTextSegment[] }
  | { type: "heading"; level: 2 | 3; text: string; href?: string }
  | { type: "list"; items: { label: string; href: string }[] }
  | { type: "bullets"; items: string[] }
  | {
      type: "statGrid";
      items: { title: string; description: string; icon: NewsStatGridIcon }[];
    }
  | {
      type: "checklistWithCallout";
      checklistTitle?: string;
      checklist: string[];
      callout: { title: string; body: string };
    }
  | {
      type: "articleCta";
      title: string;
      body: string;
      buttonLabel: string;
      href: string;
    };

/** Articles per page on /news (pagination when total exceeds this). */
export const NEWS_PAGE_SIZE = 7;

/** Homepage news block: 1 featured + this many grid cards. */
export const NEWS_HOME_PREVIEW = 2;

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
  blocks?: NewsBodyBlock[];
};

const NEWS_META = [
  {
    slug: "what-is-gsm-local-businesses",
    image: "/news/GSM_POST.png",
    date: "2026-06-02",
  },
  {
    slug: "missed-calls-are-costing-local-businesses",
    image: "/news/missedcalls_blog.png",
    date: "2026-05-20",
  },
  {
    slug: "best-bars-sotogrande",
    image: "/news/sotogrande-bars.jpg",
    date: "2026-05-20",
  },
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
      blocks: getNewsBlocks(item.slug, locale),
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

export type NewsPaginationResult = {
  items: NewsItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export function paginateNewsItems(
  items: NewsItem[],
  page: number,
  pageSize: number = NEWS_PAGE_SIZE
): NewsPaginationResult {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalItems,
    pageSize,
  };
}

export function getNewsPageHref(page: number): string {
  return page <= 1 ? "/news" : `/news?page=${page}`;
}
