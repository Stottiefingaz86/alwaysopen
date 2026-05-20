import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import { JsonLd } from "@/components/landing/json-ld";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AlwaysOpen | More bookings, better reviews, happier customers",
  description:
    "AlwaysOpen answers your business phone line with a 24/7 AI receptionist — plus booking automation, review intelligence and Voice of Customer reports for local businesses.",
  keywords: [
    "local business",
    "AI receptionist",
    "booking automation",
    "Google reviews",
    "voice of customer",
    "customer experience",
  ],
  authors: [{ name: "AlwaysOpen" }],
  openGraph: {
    title: "AlwaysOpen — Get more bookings. Improve reviews.",
    description:
      "Real phone line answered 24/7 by AI, with review intelligence and Voice of Customer reports.",
    type: "website",
    locale: "en_IE",
    siteName: "AlwaysOpen",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlwaysOpen | Local business growth system",
    description:
      "Stop missing calls. Get more bookings. Understand your customers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
