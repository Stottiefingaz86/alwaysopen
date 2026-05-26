"use client";

import { SalonWorkflowDiagram } from "@/components/landing/salon-workflow-diagram";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";

type SalonWorkflowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export function SalonWorkflowDialog({
  open,
  onOpenChange,
  title,
}: SalonWorkflowDialogProps) {
  const { m } = useLocale();
  const wf = m.industries.salonWorkflow;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(92vh,820px)] flex-col overflow-hidden border-google-gray-200 p-0 sm:max-w-3xl lg:max-w-4xl"
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b border-google-gray-100 px-5 pb-4 pt-5 pr-12">
          <DialogTitle className="text-lg font-medium text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-google-gray-500">
            {wf.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <SalonWorkflowDiagram />
        </div>
      </DialogContent>
    </Dialog>
  );
}
