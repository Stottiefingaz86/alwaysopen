"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { CtaButton } from "@/components/landing/cta-button";
import { FadeIn, Section } from "@/components/ui/section";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";
import {
  Clock,
  Heart,
  Languages,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

const MAP_QUERY = "La Chullera, Manilva, Málaga, Spain";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=en&z=13&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

const facts = [
  { icon: Languages, label: "English & Spanish" },
  { icon: Users, label: "Family business" },
  { icon: Clock, label: "16 years in industry" },
  { icon: Sparkles, label: "UX & tech background" },
];

export function AboutSection() {
  return (
    <Section id="about" background="white">
      <div className="mx-auto max-w-5xl px-0">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Blurb — mirrors FAQ left column */}
          <FadeIn className="md:w-1/3">
            <div className="md:sticky md:top-24">
              <p className="text-sm font-medium uppercase tracking-wider text-google-blue">
                About us
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                Family business, based in Spain
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-google-gray-500 md:text-base">
                <p>
                  AlwaysOpen is built and supported from{" "}
                  <strong className="font-medium text-foreground">Manilva, La Chullera</strong> on
                  the Costa del Sol. We are a family business, not a faceless call centre. We have a
                  background in <strong className="font-medium text-foreground">UX and technology</strong>,
                  and <strong className="font-medium text-foreground">16 years in the industry</strong>{" "}
                  making software and services that real people enjoy using.
                </p>
                <p>
                  We set up AI phone reception for shops, salons, clinics, and trades that lose
                  customers when nobody picks up,{" "}
                  <strong className="font-medium text-foreground">wherever you are</strong>. Every
                  setup is handled in <strong className="font-medium text-foreground">English or Spanish</strong>,
                  with clear handover and support from our team (remote onboarding works fine).
                </p>
                <p>
                  If you want your real business number answered properly, without hiring another
                  full-time receptionist, we&apos;d love to hear from you.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <CtaButton href={BOOK_MEETING_MAILTO} size="default">
                  Book Meeting
                </CtaButton>
                <CtaButton href="#faq" variant="secondary" size="default">
                  Common questions
                </CtaButton>
              </div>
            </div>
          </FadeIn>

          {/* Map + location details */}
          <FadeIn delay={0.08} className="md:w-2/3">
            <div className="relative overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-elevated">
              <BorderBeam
                size={100}
                duration={12}
                colorFrom="#3b7fd4"
                colorTo="#4a9b73"
                className="from-transparent via-google-blue/50 to-transparent"
              />

              <div className="relative aspect-[4/3] w-full min-h-[240px] sm:min-h-[280px]">
                <iframe
                  title="AlwaysOpen location, Manilva, La Chullera, Spain"
                  src={MAP_EMBED}
                  className="absolute inset-0 size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-google-gray-100 bg-google-gray-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pastel-blue text-google-blue">
                    <MapPin className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Manilva, La Chullera</p>
                    <p className="text-sm text-google-gray-500">Málaga, Costa del Sol, Spain</p>
                  </div>
                </div>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-google-blue hover:underline sm:shrink-0"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((fact) => (
                <li
                  key={fact.label}
                  className="flex items-center gap-2 rounded-xl border border-google-gray-200 bg-white px-3 py-3 text-sm font-medium text-google-gray-700 shadow-google"
                >
                  <fact.icon className="size-4 shrink-0 text-google-blue" strokeWidth={1.75} />
                  <span className="leading-tight">{fact.label}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 text-sm text-google-gray-500">
              <Heart className="size-4 shrink-0 text-google-red" strokeWidth={1.75} />
              Based in Manilva. Working with phone-first businesses in English and Spanish, near or far.
            </p>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
