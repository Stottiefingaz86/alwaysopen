"use client";

import { FadeIn } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Star,
  type LucideIcon,
} from "lucide-react";

const icons: LucideIcon[] = [Phone, Clock, MessageSquare, Star, Calendar];

function TrustCard({
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

export function TrustBar() {
  const { m } = useLocale();
  const items = m.trust.items.map((label, i) => ({
    icon: icons[i] ?? Phone,
    label,
  }));
  const row1 = items.slice(0, 2);
  const row2 = items.slice(2, 4);
  const row3 = items.slice(4, 5);

  return (
    <section className="bg-google-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeIn>
          <div className="relative mx-auto w-full max-w-md overflow-visible px-2 py-2 sm:max-w-lg sm:px-4">
            <div
              role="presentation"
              className="pointer-events-none absolute -inset-x-4 inset-y-0 z-10 bg-radial from-transparent via-transparent to-google-gray-50 to-90%"
            />
            <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
              {row1.map((item) => (
                <TrustCard key={item.label}>
                  <item.icon className="size-8" strokeWidth={1.5} />
                </TrustCard>
              ))}
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              {row2.map((item) => (
                <TrustCard key={item.label}>
                  <item.icon className="size-8" strokeWidth={1.5} />
                </TrustCard>
              ))}
              <TrustCard highlight className="bg-pastel-blue/50">
                <span
                  className="flex size-10 items-center justify-center rounded-lg bg-pastel-blue"
                  aria-hidden
                >
                  <span className="size-4 rounded-full bg-google-blue" />
                </span>
              </TrustCard>
            </div>
            <div className="mx-auto flex w-fit justify-center gap-2">
              {row3.map((item) => (
                <TrustCard key={item.label}>
                  <item.icon className="size-8" strokeWidth={1.5} />
                </TrustCard>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-lg space-y-3 text-center">
            <h2 className="text-balance text-2xl font-medium tracking-tight md:text-3xl">
              {m.trust.title}
            </h2>
            <p className="text-sm leading-relaxed text-google-gray-500 md:text-base">
              {m.trust.subtitle}
            </p>
            <ul className="flex flex-wrap justify-center gap-2 pt-2">
              {items.map((item) => (
                <li
                  key={item.label}
                  className="rounded-full border border-google-gray-200 bg-white px-3 py-1.5 text-xs text-google-gray-600"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
