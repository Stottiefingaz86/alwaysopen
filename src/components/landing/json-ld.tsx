import { COMPANY_EMAIL } from "@/lib/contact";
import { en } from "@/lib/i18n/messages/en";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const faqItems = en.faq.items;
const INSTAGRAM_URL = "https://www.instagram.com/ringsaway_com/";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "RingsAway provides 24/7 AI phone receptionists and hand-prepared Voice of Customer reports for local businesses, with Google Business guidance and industry-specific demos.",
        areaServed: "Worldwide",
        knowsLanguage: ["en", "es"],
        sameAs: [INSTAGRAM_URL],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: COMPANY_EMAIL,
          availableLanguage: ["English", "Spanish"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "AI phone receptionist and monthly customer feedback (VoC) reports for salons, clinics, restaurants, trades, and local shops.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manilva",
          addressRegion: "Málaga",
          addressCountry: "ES",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 36.376,
          longitude: -5.245,
        },
        areaServed: [
          { "@type": "Country", name: "Spain" },
          { "@type": "Place", name: "Costa del Sol" },
          { "@type": "Place", name: "Worldwide" },
        ],
        priceRange: "€€",
        telephone: "+34919935238",
        email: COMPANY_EMAIL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "es"],
        description:
          "Managed AI receptionist and booking automation for salons, restaurants, clinics, estate agents, trades, and local service businesses.",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: `${SITE_URL}/news`,
          },
          {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/book-demo`,
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/mobileWebPlatform",
              ],
            },
            name: "Book a demo",
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#ai-receptionist`,
        name: "AI Receptionist",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "24/7 AI phone answering for local businesses",
        areaServed: "Worldwide",
        description:
          "Answers your existing business phone number, books appointments, handles FAQs, and supports English and Spanish callers.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#voc-reports`,
        name: "Monthly customer feedback (VoC) reports",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "Voice of the Customer reporting",
        description:
          "Hand-prepared monthly reports covering top complaints, praise themes, customer sentiment trends, competitor comparisons, suggested Google review replies, and a prioritised action plan.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#missed-call-recovery`,
        name: "Missed Call Recovery",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "Missed call automation",
        description:
          "Routes unanswered or busy calls to an AI receptionist, sends SMS follow-ups, and captures enquiries so local businesses do not lose customers who hang up.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#booking-automation`,
        name: "Booking Automation",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "Appointment and reservation automation",
        description:
          "Captures booking details on calls, syncs with calendars where configured, and automates confirmations for salons, restaurants, clinics, and other local businesses.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#sms-reminders`,
        name: "SMS Confirmations and Reminders",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "SMS appointment notifications",
        description:
          "Sends booking confirmations and appointment reminders by SMS to reduce no-shows and manual follow-up for local service businesses.",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#bilingual-receptionist`,
        name: "Bilingual AI Receptionist",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "English and Spanish phone answering",
        description:
          "Detects caller language and handles enquiries in English or Spanish on one business phone number.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#demos`,
        name: `${SITE_NAME} industry demos`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Live AI receptionist demos by industry",
        },
        featureList: [
          "Restaurant AI receptionist demo",
          "Brows by Sarah salon demo",
          "Estate agency demo (coming soon)",
          "Clinic demo (coming soon)",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
