"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { useLocale } from "@/components/providers/locale-provider";
import { FileText, Search, Users } from "lucide-react";

const addonIcons = [FileText, Users, Search] as const;

export function AddOnsSection() {
  const { m } = useLocale();

  return (
    <Section background="gray">
      <SectionHeader title={m.addOns.title} subtitle={m.addOns.subtitle} />

      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
          <ul className="divide-y divide-google-gray-200">
            {m.addOns.items.map((addon, i) => {
              const Icon = addonIcons[i] ?? FileText;
              return (
                <li
                  key={addon.title}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-google-gray-50 sm:px-6 sm:py-5"
                >
                  <Icon className="size-5 shrink-0 text-google-gray-400" strokeWidth={1.75} />
                  <span className="flex-1 font-medium text-foreground">{addon.title}</span>
                  <span className="text-sm font-medium text-google-blue">{addon.price}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </FadeIn>
    </Section>
  );
}
