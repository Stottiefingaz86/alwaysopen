"use client";

import type { Messages } from "@/lib/i18n/messages/en";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import { Check, ListChecks } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const GOOGLE_BUSINESS_ICON = "/google-my-business-icon.svg";

type PanelKey =
  | "complaints"
  | "praise"
  | "sentiment"
  | "competitors"
  | "suggestions"
  | "google"
  | "actions";

function StarRow({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={cn(
            "size-3.5",
            i < count ? "fill-google-yellow text-google-yellow" : "fill-google-gray-200 text-google-gray-200"
          )}
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.25 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function VocReviewCard({
  author,
  source,
  quote,
  stars,
  tags,
  tagTone = "neutral",
}: {
  author: string;
  source: string;
  quote: string;
  stars: number;
  tags: string[];
  tagTone?: "negative" | "positive" | "neutral";
}) {
  const tagClass =
    tagTone === "negative"
      ? "bg-google-red/10 text-google-red"
      : tagTone === "positive"
        ? "bg-pastel-mint text-google-green"
        : "bg-pastel-lavender text-google-blue";

  return (
    <div className="w-full max-w-[240px] rounded-2xl border border-google-gray-200 bg-white p-4 shadow-google-card">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-google-gray-100 text-xs font-medium text-google-gray-700">
          {author
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{author}</p>
          <StarRow count={stars} />
        </div>
        <span className="shrink-0 text-[10px] text-google-gray-500">{source}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-google-gray-700">&ldquo;{quote}&rdquo;</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", tagClass)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SentimentChart({
  preview,
}: {
  preview: Messages["voc"]["previews"]["sentiment"];
}) {
  return (
    <div className="w-full max-w-[260px] rounded-2xl border border-google-gray-200 bg-white p-4 shadow-google-card">
      <div className="mb-3 flex items-center justify-between text-xs text-google-gray-500">
        <span>{preview.chartLabel}</span>
        <span className="font-medium text-google-green">{preview.trend}</span>
      </div>
      <div className="flex h-24 items-end justify-between gap-1.5">
        {preview.bars.map((h, i) => (
          <div key={preview.months[i]} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full max-w-7 rounded-t-md bg-google-blue/75"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: "easeOut" }}
              style={{ minHeight: 4 }}
            />
            <span className="text-[9px] text-google-gray-400">{preview.months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitorChart({
  preview,
}: {
  preview: Messages["voc"]["previews"]["competitors"];
}) {
  const maxRating = 5;

  return (
    <div className="w-full max-w-[260px] rounded-2xl border border-google-gray-200 bg-white p-4 shadow-google-card">
      <p className="text-xs font-medium text-google-gray-700">{preview.chartLabel}</p>
      <p className="mt-0.5 text-[10px] text-google-gray-500">{preview.note}</p>
      <ul className="mt-4 space-y-3">
        {preview.rows.map((row, i) => (
          <li key={row.name}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span
                className={cn(
                  "truncate font-medium",
                  row.highlight ? "text-google-blue" : "text-google-gray-700"
                )}
              >
                {row.name}
              </span>
              <span className="shrink-0 tabular-nums text-google-gray-600">{row.rating}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-google-gray-100">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  row.highlight ? "bg-google-blue" : "bg-google-gray-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(row.rating / maxRating) * 100}%` }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TypingReply({
  text,
  resetKey,
}: {
  text: string;
  resetKey: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        setDone(true);
        window.clearInterval(interval);
      }
    }, 28);
    return () => window.clearInterval(interval);
  }, [text, resetKey]);

  return (
    <p className="text-sm leading-relaxed text-google-gray-700">
      {displayed}
      {!done && (
        <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-google-blue" aria-hidden>
          &nbsp;
        </span>
      )}
    </p>
  );
}

function SuggestionsPreview({
  preview,
  activeKey,
}: {
  preview: Messages["voc"]["previews"]["suggestions"];
  activeKey: string;
}) {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-3">
      <div className="rounded-2xl border border-google-red/20 bg-google-red/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-google-red">
          {preview.reviewLabel}
        </p>
        <p className="mt-1 text-xs font-medium text-foreground">{preview.reviewAuthor}</p>
        <p className="mt-1 text-xs leading-relaxed text-google-gray-600">
          &ldquo;{preview.reviewQuote}&rdquo;
        </p>
      </div>
      <div className="rounded-2xl border border-google-gray-200 bg-white p-4 shadow-google-card">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-google-blue">
          {preview.replyLabel}
        </p>
        <div className="mt-2 min-h-[5.5rem]">
          <TypingReply text={preview.replyText} resetKey={activeKey} />
        </div>
      </div>
    </div>
  );
}

function ActionPlanPreview({
  preview,
}: {
  preview: Messages["voc"]["previews"]["actions"];
}) {
  return (
    <div className="w-full max-w-[260px] rounded-2xl border border-google-gray-200 bg-white p-4 shadow-google-card">
      <div className="flex items-center gap-2 text-google-blue">
        <ListChecks className="size-4 shrink-0" strokeWidth={1.75} />
        <p className="text-sm font-medium text-foreground">{preview.title}</p>
      </div>
      <ul className="mt-4 space-y-2.5">
        {preview.items.map((item) => {
          const tone =
            item.priority === "High" || item.priority === "Alta"
              ? "high"
              : item.priority === "Medium" || item.priority === "Media"
                ? "medium"
                : "low";

          return (
          <li key={item.text} className="flex gap-2 text-xs leading-snug">
            <span
              className={cn(
                "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                tone === "high"
                  ? "bg-google-red/10 text-google-red"
                  : tone === "medium"
                    ? "bg-pastel-blue text-google-blue"
                    : "bg-google-gray-100 text-google-gray-500"
              )}
            >
              {item.priority}
            </span>
            <span className="flex flex-1 items-start gap-1.5 text-google-gray-700">
              <Check className="mt-0.5 size-3 shrink-0 text-google-green" strokeWidth={2.5} />
              {item.text}
            </span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export function VocPanelPreview({ panel }: { panel: PanelKey }) {
  const { m } = useLocale();
  const p = m.voc.previews;

  switch (panel) {
    case "complaints":
      return (
        <VocReviewCard
          author={p.complaints.author}
          source={p.complaints.source}
          quote={p.complaints.quote}
          stars={p.complaints.stars}
          tags={[...p.complaints.tags]}
          tagTone="negative"
        />
      );
    case "praise":
      return (
        <VocReviewCard
          author={p.praise.author}
          source={p.praise.source}
          quote={p.praise.quote}
          stars={p.praise.stars}
          tags={[...p.praise.tags]}
          tagTone="positive"
        />
      );
    case "sentiment":
      return <SentimentChart preview={p.sentiment} />;
    case "competitors":
      return <CompetitorChart preview={p.competitors} />;
    case "suggestions":
      return <SuggestionsPreview preview={p.suggestions} activeKey={panel} />;
    case "actions":
      return <ActionPlanPreview preview={p.actions} />;
    case "google":
      return (
        <Image
          src={GOOGLE_BUSINESS_ICON}
          alt={m.voc.panels.google.imageAlt}
          width={160}
          height={140}
          className="h-28 w-auto max-w-[200px] object-contain sm:h-32"
        />
      );
    default:
      return null;
  }
}
