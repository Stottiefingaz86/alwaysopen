/** Stored in `voc_reports.report_data` — mirrors demo VoC industry shape. */
export type VocReportData = {
  businessName: string;
  location: string;
  listingGapsTitle: string;
  source: string;
  /** Reviews published in the report month (primary count for owners) */
  reviewCount: number;
  /** All reviews returned by the Google scrape (may span earlier months) */
  scrapedReviewTotal?: number;
  score: number;
  scoreLabel: string;
  period: string;
  /** Owner-facing overview (2–4 sentences) */
  executiveSummary?: string;
  metrics: readonly {
    key: string;
    label: string;
    value: number;
    color: "violet" | "amber" | "green" | "red";
  }[];
  /** Mean metric scores from other portfolio businesses in the same location + tag */
  areaMetricBenchmark?: {
    location: string;
    tagLabel: string;
    peerCount: number;
    averages: readonly { key: string; average: number }[];
  };
  sentiment: {
    chartLabel: string;
    trend: string;
    months: readonly string[];
    bars: readonly number[];
    /** Plain-language explanation of the trend chart for owners */
    explanation?: string;
    methodNote?: string;
  };
  /** Gaps vs other tagged businesses in your area (portfolio) */
  marketGaps?: {
    title: string;
    summary: string;
    gaps: readonly string[];
    peersCompared: readonly string[];
  };
  menuGaps: readonly string[];
  trending: readonly {
    topic: string;
    count: number;
    tone: "negative" | "positive" | "neutral";
  }[];
  positives: readonly string[];
  negatives: readonly string[];
  recommendations: readonly { priority: string; text: string }[];
  monthlyReport: {
    complaints: {
      /** Synthesis of all negative themes / low-star patterns — not just the sample quote */
      summary?: string;
      themes: readonly string[];
      review: {
        author: string;
        source: string;
        stars?: number;
        quote: string;
        tags: readonly string[];
        date?: string | null;
      };
      /** Extra negative snippets from the scrape (verbatim) */
      moreReviews?: readonly {
        author: string;
        source: string;
        stars?: number;
        quote: string;
        tags: readonly string[];
        date?: string | null;
      }[];
    };
    praise: {
      summary?: string;
      themes: readonly string[];
      review: {
        author: string;
        source: string;
        stars?: number;
        quote: string;
        tags: readonly string[];
        date?: string | null;
      };
      moreReviews?: readonly {
        author: string;
        source: string;
        stars?: number;
        quote: string;
        tags: readonly string[];
        date?: string | null;
      }[];
    };
    competitors: {
      summary?: string;
      chartLabel: string;
      note: string;
      /** Portfolio peers in same location + tag (not review text) */
      areaBenchmark?: boolean;
      rows: readonly { name: string; rating: number; highlight: boolean }[];
      /** Verbatim comparison reviews from scraped Google data */
      mentions?: readonly {
        name: string;
        quote: string;
        author: string;
        date?: string | null;
        stars?: number | null;
        source: string;
      }[];
    };
    suggestions: {
      /** e.g. "6 low-star reviews still need a Google reply" */
      summary?: string;
      items: readonly {
        reviewLabel: string;
        reviewAuthor: string;
        reviewQuote: string;
        stars?: number;
        date?: string | null;
        replyLabel: string;
        replyText: string;
      }[];
    };
    googleStrategy: readonly string[];
    googleStrategySummary?: string;
  };
  actionPlanSummary?: string;
  /** Verbatim Google reviews from this scrape — used to match theme chips to real quotes */
  reviewCorpus?: readonly {
    author: string;
    source: string;
    stars?: number;
    quote: string;
    tags: readonly string[];
    date?: string | null;
  }[];
};

export type ScrapedGoogleReview = {
  stars?: number;
  text?: string;
  publishedAtDate?: string;
  name?: string;
  reviewUrl?: string;
  placeId?: string;
  responseFromOwnerText?: string | null;
};
