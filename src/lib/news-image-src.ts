import type { NewsItem } from "@/lib/news-content";

export function newsImageSrc(
  item: NewsItem,
  versions: Record<string, string>
): string {
  const v = versions[item.slug];
  return v ? `${item.image}?v=${v}` : item.image;
}
