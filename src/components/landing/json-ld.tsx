export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RingsAway",
    applicationCategory: "BusinessApplication",
    description:
      "RingsAway helps local businesses capture more customers with a 24/7 AI receptionist, booking automation, and hand-prepared customer feedback (VoC) reports with action plans and Google Business strategy.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "199",
      highPrice: "799",
      priceCurrency: "EUR",
    },
    operatingSystem: "Web",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
