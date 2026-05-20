import { CtaButton } from "@/components/landing/cta-button";
import { NewsCoverImage } from "@/components/landing/news-cover-image";
import {
  categoryLabels,
  formatNewsDate,
  type NewsItem,
} from "@/lib/news-content";
import { BOOK_MEETING_MAILTO, TALK_OVER_COFFEE_CTA } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

function CategoryBadge({ category }: { category: NewsItem["category"] }) {
  const styles = {
    article: "bg-pastel-blue text-google-blue",
    update: "bg-google-green/10 text-google-green",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[category]
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}

export function NewsArticleView({
  article,
  imageVersions,
}: {
  article: NewsItem;
  imageVersions: Record<string, string>;
}) {
  return (
    <article>
      <NewsCoverImage
        item={article}
        imageVersions={imageVersions}
        className="h-48 w-full sm:h-64 md:h-72"
        priority
      />

      <header className="border-b border-google-gray-100 bg-google-gray-50/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline"
          >
            <ArrowLeft className="size-4" />
            All news
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={article.category} />
            <time className="text-xs text-google-gray-500" dateTime={article.date}>
              {formatNewsDate(article.date)}
            </time>
            <span className="text-xs text-google-gray-400">· {article.readTime}</span>
          </div>
          <h1 className="mt-4 text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {article.title}
          </h1>
          {article.tags && article.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-white px-2 py-0.5 text-xs text-google-gray-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="space-y-4 text-[15px] leading-relaxed text-google-gray-700">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <footer className="border-t border-google-gray-100 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-sm text-google-gray-500">
            {article.category === "update" ? (
              <Sparkles className="size-4 text-google-green" />
            ) : (
              <FileText className="size-4 text-google-blue" />
            )}
            From the RingsAway team
          </p>
          <CtaButton href={BOOK_MEETING_MAILTO} size="default">
            {TALK_OVER_COFFEE_CTA}
          </CtaButton>
        </div>
      </footer>
    </article>
  );
}
