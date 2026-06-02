"use client";

import { getNewsPageHref } from "@/lib/news-content";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type NewsPaginationProps = {
  currentPage: number;
  totalPages: number;
  prevLabel: string;
  nextLabel: string;
  ariaLabel: string;
  pageLabel: string;
};

export function NewsPagination({
  currentPage,
  totalPages,
  prevLabel,
  nextLabel,
  ariaLabel,
  pageLabel,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 border-t border-google-gray-100 pt-8"
      aria-label={ariaLabel}
    >
      <p className="text-sm text-google-gray-500">
        {pageLabel
          .replace("{current}", String(currentPage))
          .replace("{total}", String(totalPages))}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={getNewsPageHref(currentPage - 1)}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border border-google-gray-200 bg-white px-4 py-2 text-sm font-medium text-foreground",
              "shadow-google transition-colors hover:border-google-blue/30 hover:text-google-blue"
            )}
          >
            <ChevronLeft className="size-4" aria-hidden />
            {prevLabel}
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-xl border border-google-gray-100 bg-google-gray-50 px-4 py-2 text-sm font-medium text-google-gray-400"
            aria-disabled
          >
            <ChevronLeft className="size-4" aria-hidden />
            {prevLabel}
          </span>
        )}

        <ul className="flex flex-wrap items-center justify-center gap-1">
          {pageNumbers.map((page) => (
            <li key={page}>
              {page === currentPage ? (
                <span
                  className="flex size-9 items-center justify-center rounded-lg bg-google-blue text-sm font-medium text-white"
                  aria-current="page"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={getNewsPageHref(page)}
                  className="flex size-9 items-center justify-center rounded-lg text-sm font-medium text-google-gray-600 transition-colors hover:bg-google-gray-100 hover:text-google-blue"
                >
                  {page}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {currentPage < totalPages ? (
          <Link
            href={getNewsPageHref(currentPage + 1)}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border border-google-gray-200 bg-white px-4 py-2 text-sm font-medium text-foreground",
              "shadow-google transition-colors hover:border-google-blue/30 hover:text-google-blue"
            )}
          >
            {nextLabel}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-xl border border-google-gray-100 bg-google-gray-50 px-4 py-2 text-sm font-medium text-google-gray-400"
            aria-disabled
          >
            {nextLabel}
            <ChevronRight className="size-4" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
