import type { Locale } from "@/lib/i18n/types";
import type { NewsBodyBlock } from "@/lib/news-content";
import {
  bestBarsSotograndeEn,
  bestBarsSotograndeEs,
} from "@/lib/news-articles/best-bars-sotogrande";
import {
  missedCallsEn,
  missedCallsEs,
} from "@/lib/news-articles/missed-calls-are-costing-local-businesses";
import {
  whatIsGsmEn,
  whatIsGsmEs,
} from "@/lib/news-articles/what-is-gsm-local-businesses";

const BLOCKS_BY_SLUG: Partial<Record<string, Partial<Record<Locale, NewsBodyBlock[]>>>> = {
  "what-is-gsm-local-businesses": {
    en: whatIsGsmEn,
    es: whatIsGsmEs,
  },
  "missed-calls-are-costing-local-businesses": {
    en: missedCallsEn,
    es: missedCallsEs,
  },
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
