"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { FileText, Search, Zap, UserPlus, Phone } from "lucide-react";

const addOns = [
  { title: "Extra customer feedback reporting", price: "€299/month", icon: FileText },
  { title: "Digital CX audit", price: "€499", icon: Search },
  { title: "Extra automation", price: "From €250", icon: Zap },
  { title: "Extra user/calendar", price: "€50/month", icon: UserPlus },
  { title: "Extra number", price: "Pass-through + €25", icon: Phone },
];

export function AddOnsSection() {
  return (
    <Section background="gray">
      <SectionHeader title="Add-ons" subtitle="Extend your plan as your business grows." />

      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
          <ul className="divide-y divide-google-gray-200">
            {addOns.map((addon) => (
              <li
                key={addon.title}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-google-gray-50 sm:px-6 sm:py-5"
              >
                <addon.icon className="size-5 shrink-0 text-google-gray-400" strokeWidth={1.75} />
                <span className="flex-1 font-medium text-foreground">{addon.title}</span>
                <span className="text-sm font-medium text-google-blue">{addon.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </Section>
  );
}
