"use client";

import { NewsPagination } from "@/components/landing/news-pagination";
import { useLocale } from "@/components/providers/locale-provider";
import {
  formatNewsDate,
  getCategoryLabel,
  getNewsItems,
  paginateNewsItems,
} from "@/lib/news-content";
import { NewsCoverImage } from "@/components/landing/news-cover-image";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function NewsIndexContent({
  imageVersions,
}: {
  imageVersions: Record<string, string>;
}) {
  const { m, locale } = useLocale();
  const searchParams = useSearchParams();
  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const requestedPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const allItems = getNewsItems(locale);
  const { items: newsItems, currentPage, totalPages } = paginateNewsItems(
    allItems,
    requestedPage
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        {m.news.backToHomepage}
      </Link>
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
          {m.news.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          {m.news.indexTitle}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-google-gray-500">
          {m.news.indexSubtitle}
        </p>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12">
        {newsItems.map((item) => (
          <li key={item.id}>
            <Link
              href={`/news/${item.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card transition-all hover:border-google-blue/30 hover:shadow-google-elevated"
            >
              <NewsCoverImage item={item} imageVersions={imageVersions} className="h-40 w-full" />
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      item.category === "article"
                        ? "bg-pastel-blue text-google-blue"
                        : "bg-google-green/10 text-google-green"
                    )}
                  >
                    {getCategoryLabel(item.category, locale)}
                  </span>
                  <time className="text-xs text-google-gray-500" dateTime={item.date}>
                    {formatNewsDate(item.date, locale)}
                  </time>
                </div>
                <h2 className="mt-3 text-lg font-medium leading-snug text-foreground group-hover:text-google-blue">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-google-gray-600">
                  {item.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue">
                  {m.news.readArticle}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <NewsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevLabel={m.news.paginationPrev}
        nextLabel={m.news.paginationNext}
        ariaLabel={m.news.paginationLabel}
        pageLabel={m.news.paginationPage}
      />

      <p className="mt-10 text-center text-sm text-google-gray-500">
        <Link href="/" className="font-medium text-google-blue hover:underline">
          {m.news.backHome}
        </Link>
      </p>
    </div>
  );
}
