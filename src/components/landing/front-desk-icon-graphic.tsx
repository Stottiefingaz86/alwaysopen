"use client";

import { FadeIn } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Star,
} from "lucide-react";

function IconTile({
  children,
  className,
  highlight,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex size-20 items-center justify-center rounded-xl bg-white dark:bg-transparent",
        className
      )}
    >
      <div
        role="presentation"
        className={cn(
          "absolute inset-0 rounded-xl border",
          highlight
            ? "border-google-blue/40 shadow-google-elevated"
            : "border-google-gray-200"
        )}
      />
      <div className="relative z-10 m-auto size-fit text-google-blue">{children}</div>
    </div>
  );
}

/** Icon cluster from the former trust bar — shown above add-ons */
export function FrontDeskIconGraphic({ className }: { className?: string }) {
  return (
    <FadeIn className={cn("mb-8 md:mb-10", className)}>
      <div
        className="relative mx-auto w-full max-w-md overflow-visible px-2 py-2 sm:max-w-lg sm:px-4"
        aria-hidden
      >
        <div
          role="presentation"
          className="pointer-events-none absolute -inset-x-4 inset-y-0 z-10 bg-radial from-transparent via-transparent to-google-gray-50 to-90%"
        />
        <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
          <IconTile>
            <Phone className="size-8" strokeWidth={1.5} />
          </IconTile>
          <IconTile>
            <Clock className="size-8" strokeWidth={1.5} />
          </IconTile>
        </div>
        <div className="mx-auto my-2 flex w-fit justify-center gap-2">
          <IconTile>
            <MessageSquare className="size-8" strokeWidth={1.5} />
          </IconTile>
          <IconTile>
            <Star className="size-8" strokeWidth={1.5} />
          </IconTile>
          <IconTile highlight className="bg-pastel-blue/50">
            <span className="flex size-10 items-center justify-center rounded-lg bg-pastel-blue">
              <span className="size-4 rounded-full bg-google-blue" />
            </span>
          </IconTile>
        </div>
        <div className="mx-auto flex w-fit justify-center gap-2">
          <IconTile>
            <Calendar className="size-8" strokeWidth={1.5} />
          </IconTile>
        </div>
      </div>
    </FadeIn>
  );
}
