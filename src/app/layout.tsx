import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Manjari } from "next/font/google";
import { JsonLd } from "@/components/landing/json-ld";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manjari = Manjari({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 24/7 AI receptionist for local businesses`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "RingsAway is a managed AI receptionist and booking automation service for local businesses. 24/7 phone answering on your real number, missed-call recovery, SMS confirmations and reminders, follow-ups, review intelligence, and monthly Voice of Customer reports. English and Spanish. Based in Manilva, Spain — Costa del Sol and worldwide remote onboarding.",
  keywords: [
    "AI receptionist",
    "AI receptionist for salons",
    "AI receptionist for restaurants",
    "24/7 phone answering",
    "missed call recovery",
    "local business",
    "booking automation",
    "SMS appointment reminders",
    "bilingual AI receptionist",
    "English Spanish receptionist",
    "Google Business Profile",
    "Google reviews",
    "voice of customer",
    "VoC report",
    "customer sentiment analysis",
    "Costa del Sol",
    "Manilva Spain",
    "Gibraltar business phone",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | AI receptionist & monthly customer feedback reports`,
    description:
      "Your real business number answered 24/7 by AI. Monthly VoC reports with complaints, praise, sentiment charts, and Google reply suggestions.",
    type: "website",
    locale: "en_IE",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 24/7 AI receptionist for local businesses`,
    description:
      "Stop missing calls. Get more bookings. Understand your customers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, manjari.variable)}>
      <body className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
        <LocaleProvider>
          <JsonLd />
          {children}
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
