"use client";

import { CtaButton } from "@/components/landing/cta-button";
import { NewsCoverImage } from "@/components/landing/news-cover-image";
import { useLocale } from "@/components/providers/locale-provider";
import {
  formatNewsDate,
  getCategoryLabel,
  type NewsItem,
} from "@/lib/news-content";
import { getContactHref, getTalkOverCoffeeCta } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { NewsArticleContent } from "@/components/landing/news-article-content";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export function NewsArticleView({
  article,
  imageVersions,
}: {
  article: NewsItem;
  imageVersions: Record<string, string>;
}) {
  const { m, locale } = useLocale();
  const contactHref = getContactHref(false);

  const categoryClass =
    article.category === "article"
      ? "bg-pastel-blue text-google-blue"
      : "bg-google-green/10 text-google-green";

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
          <nav
            aria-label="Article navigation"
            className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              {m.news.backToHomepage}
            </Link>
            <Link
              href="/news"
              className="text-sm text-google-gray-600 transition-colors hover:text-google-blue sm:pl-4 sm:border-l sm:border-google-gray-200"
            >
              {m.news.allNews}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                categoryClass
              )}
            >
              {getCategoryLabel(article.category, locale)}
            </span>
            <time className="text-xs text-google-gray-500" dateTime={article.date}>
              {formatNewsDate(article.date, locale)}
            </time>
            <span className="text-xs text-google-gray-400">· {article.readTime}</span>
          </div>
          <h1 className="mt-4 text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-google-gray-500 sm:text-lg">
            {article.excerpt}
          </p>
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
        {article.blocks && article.blocks.length > 0 ? (
          <NewsArticleContent blocks={article.blocks} />
        ) : (
          <div className="space-y-4 text-[15px] leading-relaxed text-google-gray-700">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-google-gray-100 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-sm text-google-gray-500">
            {article.category === "update" ? (
              <Sparkles className="size-4 text-google-green" />
            ) : (
              <FileText className="size-4 text-google-blue" />
            )}
            {m.news.fromTeam}
          </p>
          <CtaButton href={contactHref} size="default">
            {getTalkOverCoffeeCta(locale)}
          </CtaButton>
        </div>
      </footer>
    </article>
  );
}
