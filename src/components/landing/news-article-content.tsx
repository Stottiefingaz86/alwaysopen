import type { NewsBodyBlock, NewsStatGridIcon } from "@/lib/news-content";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Check,
  Coffee,
  Phone,
  PoundSterling,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

function InlineSegments({
  segments,
}: {
  segments: Extract<NewsBodyBlock, { type: "paragraph" }>["segments"];
}) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "text" ? (
          <span key={i}>{segment.value}</span>
        ) : (
          <Link
            key={i}
            href={segment.href}
            className="font-medium text-google-blue underline-offset-2 hover:underline"
            target={segment.href.startsWith("http") ? "_blank" : undefined}
            rel={segment.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {segment.label}
          </Link>
        )
      )}
    </>
  );
}

const statIcons: Record<NewsStatGridIcon, LucideIcon> = {
  intent: PoundSterling,
  phone: Phone,
  growth: TrendingUp,
  loss: TrendingDown,
};

function SectionHeading({
  level,
  text,
  href,
}: {
  level: 2 | 3;
  text: string;
  href?: string;
}) {
  const className =
    level === 2
      ? "border-b border-google-blue/25 pb-2 pt-4 text-xl font-medium tracking-tight text-foreground"
      : "pt-1 text-lg font-medium text-foreground";

  if (href) {
    return (
      <h3 className={className}>
        <Link
          href={href}
          className="text-google-blue underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </Link>
      </h3>
    );
  }

  const Tag = level === 2 ? "h2" : "h3";
  return <Tag className={className}>{text}</Tag>;
}

export function NewsArticleContent({ blocks }: { blocks: NewsBodyBlock[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-google-gray-700">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i}>
              <InlineSegments segments={block.segments} />
            </p>
          );
        }

        if (block.type === "heading") {
          return (
            <SectionHeading
              key={i}
              level={block.level}
              text={block.text}
              href={block.href}
            />
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "statGrid") {
          return (
            <div
              key={i}
              className="grid gap-3 py-2 sm:grid-cols-2 lg:grid-cols-4"
            >
              {block.items.map((item) => {
                const Icon = statIcons[item.icon];
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-google-gray-200 bg-white p-4 shadow-google"
                  >
                    <span className="flex size-10 items-center justify-center rounded-full border border-google-blue/20 bg-pastel-blue/50 text-google-blue">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-google-gray-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        }

        if (block.type === "checklistWithCallout") {
          return (
            <div
              key={i}
              className="grid gap-6 py-2 md:grid-cols-[1fr_minmax(0,17rem)] md:items-start"
            >
              <div>
                {block.checklistTitle ? (
                  <p className="mb-3 text-sm font-medium text-foreground">
                    {block.checklistTitle}
                  </p>
                ) : null}
                <ul className="space-y-2.5">
                  {block.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pastel-blue text-google-blue">
                        <Check className="size-3" strokeWidth={2.5} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-google-blue/15 bg-linear-to-br from-pastel-blue/50 via-white to-white p-5 shadow-google">
                <span className="flex size-11 items-center justify-center rounded-xl bg-google-blue/10 text-google-blue">
                  <Bot className="size-6" strokeWidth={1.5} aria-hidden />
                </span>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {block.callout.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-google-gray-600">
                  {block.callout.body}
                </p>
              </div>
            </div>
          );
        }

        if (block.type === "articleCta") {
          return (
            <div
              key={i}
              className="mt-4 flex flex-col gap-4 rounded-2xl border border-google-blue/15 bg-pastel-blue/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-google-blue shadow-google">
                  <Coffee className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-base font-medium text-foreground">{block.title}</p>
                  <p className="mt-1 text-sm text-google-gray-600">{block.body}</p>
                </div>
              </div>
              <Link
                href={block.href}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white",
                  "bg-[var(--pastel-blue-deep)] shadow-[var(--shadow-soft)]",
                  "hover:bg-[var(--pastel-blue-hover)] active:scale-[0.98]"
                )}
              >
                {block.buttonLabel}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-medium text-google-blue underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </div>
  );
}
