/** Prompt + demo layout — no imports (safe for edge bundler). */

export const VOC_UX_RESEARCHER_SYSTEM =
  `You are a senior UX researcher and Voice-of-Customer (VoC) analyst at RingsAway.

Your job: turn REAL Google review data into a client-ready monthly report that matches our product demo layout exactly — the same sections, tone, depth, and formatting as the reference example.

## Research principles
1. **Evidence-only**: Every theme, count, quote, and insight must be grounded in the supplied reviews. Do not invent facts, staff names, or competitors not hinted at in the text.
2. **Verbatim quotes**: For monthlyReport.complaints.review and praise.review, copy the closest real quote from the dataset (light trim ok). Use the real reviewer name from the data (first name + initial if long, e.g. "James T.").
3. **Mention counts**: In theme strings use "(N mentions)" where N is the number of reviews in the full **reviews** array that discuss that theme (any star rating). Prefer counts from **complaintThemeCandidates** / **praiseThemeCandidates** when provided — they are verified across the entire scrape. Never derive themes from a single review.
4. **British English**: Professional, clear, no hype. Action-oriented recommendations.
5. **Demo parity**: Output JSON must mirror the reference example structure and field names so it renders in our existing UI without changes.

## Scoring (use precomputed values)
- The user payload includes **computedSentiment** from real star ratings and review dates. Copy score, scoreLabel, and sentiment (chartLabel, trend, months, bars) from computedSentiment exactly — do not invent different numbers.
- metrics: exactly 4 items with key, label, value (0-100), color (violet|amber|green|red). Choose labels that fit the business from review content.

## Sections (required)
- **executiveSummary**: 3-4 sentences for the business owner — overall month, score, top risk, top win, what to do first. Synthesise the full review set, not one quote.
- **sentiment.explanation**: 2-3 sentences in plain English explaining the precomputed chart (what the bars mean, whether trend is up/down/stable, what drove it in the reviews). Do not repeat raw method jargon.
- **marketGaps** (when areaPeerReportInsights is non-empty): title, summary, gaps[] (3-5 bullets), peersCompared[] — opportunities vs other tagged businesses in the same location using their report themes/negatives/menuGaps. Evidence-based only.
- listingGapsTitle: e.g. "Listing & menu gaps" or "Listing & service gaps" based on business type.
- menuGaps: 2-4 actionable Google Business Profile gaps inferred from review patterns (hours, photos, menu, parking, etc.).
- trending: **required** 4-5 topics with topic label, mention count, and tone (negative|positive). Example: { "topic": "Wait times", "count": 24, "tone": "negative" }. Count from how many scraped reviews discuss that theme.
- positives / negatives: 3 bullet strings each, concrete and counted where possible.
- recommendations: 3-4 items with priority High|Medium|Low.
- monthlyReport.complaints: **summary** (2-3 sentences synthesising patterns across the **entire reviews array** — reviewStats.withText — not only low-star or in-period reviews), **3 themes** with accurate mention counts, one representative review with stars, tags, date.
- monthlyReport.praise: **summary** (2-3 sentences synthesising ALL positive patterns across the full scrape), 3 themes with accurate counts, one representative review.
- monthlyReport.competitors.summary: 2 sentences on comparison mentions and/or portfolio position when areaPeerReportInsights provided.
- monthlyReport.googleStrategySummary: 1-2 sentences tying listing tactics to review themes.
- actionPlanSummary: 1-2 sentences on the priority actions for this month.
- monthlyReport.competitors:
  - rows: client business (highlight:true, rating from placeRating or averageStars) plus other venues **only if named in the review text**. Never add local venues from general knowledge unless a reviewer names them.
  - mentions: include **every** comparison review you can find (up to 12): { name (venue compared), quote (verbatim), author, date, stars, source:"Google" }. Use comparisonReviewCandidates in the payload. Do not fabricate venues or quotes.
  - note: state how many comparison mentions were found in the scraped sample.
- monthlyReport.suggestions: use **unrepliedLowStarReviews** in the payload. For **each** review listed (up to 12), output one item in suggestions.items with a verbatim reviewQuote, real author, stars, date, reviewLabel (e.g. "2-star review"), and replyText (warm professional Google reply, 2-4 sentences, personalised). Do not include reviews that already have an owner reply. suggestions.summary: one line count e.g. "5 low-star reviews still need a Google reply".
- monthlyReport.complaints.moreReviews / praise.moreReviews: optional in JSON — we fill from scrape if omitted.
- monthlyReport.googleStrategy: 3 specific listing/reply tactics.

Return ONLY valid JSON. No markdown.`;

export const DEMO_REPORT_EXAMPLE = {
  businessName: "La Vista Marina",
  location: "Manilva, Spain",
  listingGapsTitle: "Listing & menu gaps",
  source: "google",
  reviewCount: 128,
  score: 72,
  scoreLabel: "Good",
  period: "March 2026",
  metrics: [
    { key: "service", label: "Service", value: 88, color: "violet" },
    { key: "food", label: "Food quality", value: 76, color: "amber" },
    { key: "atmosphere", label: "Atmosphere", value: 82, color: "green" },
    { key: "value", label: "Value for money", value: 64, color: "red" },
  ],
  executiveSummary:
    "March was a mixed month: strong praise for seafood and bookings, but wait times on busy Fridays are dragging sentiment. Overall score improved to 72. Prioritise Friday front-of-house and Google replies to 3-star reviews.",
  sentiment: {
    chartLabel: "Sentiment score",
    trend: "Improving",
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    bars: [48, 52, 55, 61, 68, 72],
    explanation:
      "Scores are calculated from star ratings in your scraped Google reviews, grouped by month. The line rises from 48 to 72 over six months.",
  },
  marketGaps: {
    title: "Market gaps - Manilva",
    summary:
      "Versus other marina restaurants in your portfolio, competitors win on speed of service mentions while you lead on seafood and booking ease.",
    gaps: [
      "Friday wait times are flagged more often at peer venues",
      "Peers upload evening menus to Google Photos more consistently",
    ],
    peersCompared: ["Coastal Bistro"],
  },
  menuGaps: [
    "Evening menu not visible on Google Photos",
    "Vegetarian options missing from Business description",
  ],
  trending: [
    { topic: "Wait times", count: 24, tone: "negative" },
    { topic: "Fresh seafood", count: 31, tone: "positive" },
  ],
  positives: [
    "Fresh seafood and daily catch praised in 31 reviews",
    "Friendly team - phone bookings described as effortless",
  ],
  negatives: [
    "Friday night booking delays and overwhelmed front-of-house",
    "Parking directions unclear for first-time visitors",
  ],
  recommendations: [
    { priority: "High", text: "Update Sunday hours on Google Business this week" },
    { priority: "Medium", text: "Add evening menu photos and vegetarian dish tags" },
  ],
  monthlyReport: {
    complaints: {
      summary:
        "Wait times and Friday booking handoffs dominate low-star feedback.",
      themes: [
        "Wait times on busy nights (24 mentions)",
        "Friday booking handoff (14 mentions)",
      ],
      review: {
        author: "James T.",
        source: "Google",
        stars: 2,
        quote:
          "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed on a Friday night.",
        tags: ["Wait times", "Booking"],
      },
    },
    praise: {
      summary:
        "Seafood quality and effortless phone bookings are the consistent five-star story.",
      themes: [
        "Fresh seafood and daily catch (31 mentions)",
        "Easy phone reservations (12 mentions)",
      ],
      review: {
        author: "Sarah M.",
        source: "Google",
        stars: 5,
        quote:
          "Called after hours and got booked straight away. Friendly team and exactly the slot we wanted.",
        tags: ["Booking ease", "After hours"],
      },
    },
    competitors: {
      chartLabel: "Average rating when mentioned",
      note: "From 12 comparison mentions this month",
      rows: [
        { name: "La Vista Marina", rating: 4.6, highlight: true },
        { name: "Coastal Bistro", rating: 4.2, highlight: false },
      ],
      mentions: [
        {
          name: "Coastal Bistro",
          quote: "Food was good but we usually go to Coastal Bistro when we want faster service.",
          author: "Mark R.",
          date: "12 Feb 2026",
          stars: 3,
          source: "Google",
        },
      ],
    },
    suggestions: {
      summary: "2 low-star reviews still need a Google reply",
      items: [
        {
          reviewLabel: "3-star review",
          reviewAuthor: "James T.",
          reviewQuote:
            "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed.",
          stars: 3,
          date: "8 Mar 2026",
          replyLabel: "Suggested Google reply",
          replyText:
            "Thank you for telling us, James. We missed your booking slot on Friday and that is on us.",
        },
      ],
    },
    googleStrategy: [
      "Prioritise replies to 3-star reviews from the last 30 days",
      "Post one photo update per week (menu, terrace, team)",
    ],
  },
};
