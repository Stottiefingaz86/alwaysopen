"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";
import {
  getLegalDocument,
  type LegalDocumentKey,
} from "@/lib/i18n/legal-documents";

type LegalDocumentDialogProps = {
  documentKey: LegalDocumentKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LegalDocumentDialog({
  documentKey,
  open,
  onOpenChange,
}: LegalDocumentDialogProps) {
  const { m, locale } = useLocale();

  if (!documentKey) return null;

  const doc = getLegalDocument(documentKey, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(90vh,720px)] flex-col overflow-hidden border-google-gray-200 p-0 sm:max-w-2xl"
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b border-google-gray-100 px-5 pb-4 pt-5 pr-12">
          <DialogTitle className="text-lg font-medium text-foreground">
            {doc.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-google-gray-500">
            {m.footer.legalLastUpdated} {doc.lastUpdated}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5 text-sm leading-relaxed text-google-gray-700">
            {doc.sections.map((section, index) => (
              <section key={index}>
                {section.heading ? (
                  <h3 className="mb-2 text-sm font-medium text-foreground">
                    {section.heading}
                  </h3>
                ) : null}
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
