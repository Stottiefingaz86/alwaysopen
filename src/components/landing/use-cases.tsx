"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, Section } from "@/components/ui/section";

const quotes = [
  {
    name: "Maria K.",
    role: "Dental clinic, Dublin",
    initials: "MK",
    quote:
      "We miss fewer new-patient calls. Evening enquiries get booked before we open the next day.",
  },
  {
    name: "James T.",
    role: "Plumber, Cork",
    initials: "JT",
    quote:
      "Same number on the van and Google — AI picks up when I'm on a job. No more voicemail tag.",
  },
  {
    name: "Aoife R.",
    role: "Hair salon, Galway",
    initials: "AR",
    quote:
      "Review summaries told us wait times were the issue. Fixed scheduling — ratings climbed in weeks.",
  },
  {
    name: "Patrick L.",
    role: "Physio practice",
    initials: "PL",
    quote:
      "Monthly VoC reports are short and practical. We know what to fix without reading 200 reviews.",
  },
  {
    name: "Niamh C.",
    role: "Vet clinic",
    initials: "NC",
    quote:
      "Callers don't realise it's not our receptionist. Bookings land in the calendar with notes.",
  },
  {
    name: "Sean B.",
    role: "Electrician",
    initials: "SB",
    quote:
      "One missed emergency call pays for the month. Worth it before we hired a part-time admin.",
  },
];

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const columns = chunkArray(quotes, Math.ceil(quotes.length / 3));

export function UseCasesSection() {
  return (
    <Section id="use-cases" background="white">
      <FadeIn>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
            Sound familiar?
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Local owners using AlwaysOpen
          </h2>
          <p className="text-google-gray-500">
            If any of these sound like your week, you&apos;re not alone — and you
            don&apos;t need another dashboard to fix it.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-3">
            {column.map((item, index) => (
              <FadeIn key={item.name} delay={columnIndex * 0.05 + index * 0.04}>
                <Card className="border-google-gray-200 shadow-none">
                  <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                    <Avatar className="size-9 bg-pastel-blue text-google-blue">
                      <AvatarFallback className="bg-pastel-blue text-sm font-medium text-google-blue">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="block text-sm text-google-gray-500">
                        {item.role}
                      </span>
                      <blockquote className="mt-3">
                        <p className="text-sm leading-relaxed text-google-gray-700">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
