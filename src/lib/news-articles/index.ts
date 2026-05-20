import type { Locale } from "@/lib/i18n/types";
import type { NewsBodyBlock } from "@/lib/news-content";
import {
  bestBarsSotograndeEn,
  bestBarsSotograndeEs,
} from "@/lib/news-articles/best-bars-sotogrande";

const BLOCKS_BY_SLUG: Partial<Record<string, Partial<Record<Locale, NewsBodyBlock[]>>>> = {
  "best-bars-sotogrande": {
    en: bestBarsSotograndeEn,
    es: bestBarsSotograndeEs,
  },
};

export function getNewsBlocks(
  slug: string,
  locale: Locale
): NewsBodyBlock[] | undefined {
  return BLOCKS_BY_SLUG[slug]?.[locale];
}
