"use client";

import { CtaButton } from "@/components/landing/cta-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import {
  categoryLabels,
  formatNewsDate,
  type NewsItem,
} from "@/lib/news-content";
import { cn } from "@/lib/utils";
import { FileText, Sparkles } from "lucide-react";

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

type ArticleDialogProps = {
  article: NewsItem | null;
  onClose: () => void;
};

export function ArticleDialog({ article, onClose }: ArticleDialogProps) {
  return (
    <Dialog
      open={article !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-h-[min(90vh,800px)] max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton
      >
        {article && (
          <>
            <div className="border-b border-google-gray-100 bg-google-gray-50/80 px-6 py-5 sm:px-8">
              <DialogHeader className="gap-3 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={article.category} />
                  <time className="text-xs text-google-gray-500" dateTime={article.date}>
                    {formatNewsDate(article.date)}
                  </time>
                  <span className="text-xs text-google-gray-400">
                    · {article.readTime}
                  </span>
                </div>
                <DialogTitle className="text-left text-xl font-medium leading-snug text-foreground sm:text-2xl">
                  {article.title}
                </DialogTitle>
                {article.tags && article.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 pt-1">
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
              </DialogHeader>
            </div>

            <div className="max-h-[50vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <div className="prose prose-sm max-w-none space-y-4 text-[15px] leading-relaxed text-google-gray-700">
                {article.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-google-gray-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="flex items-center gap-2 text-sm text-google-gray-500">
                {article.category === "update" ? (
                  <Sparkles className="size-4 text-google-green" />
                ) : (
                  <FileText className="size-4 text-google-blue" />
                )}
                From the AlwaysOpen team
              </p>
              <CtaButton href={BOOK_MEETING_MAILTO} size="default">
                Book Meeting
              </CtaButton>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
