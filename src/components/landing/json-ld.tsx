export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AlwaysOpen",
    applicationCategory: "BusinessApplication",
    description:
      "AlwaysOpen helps local businesses capture more customers with a 24/7 AI receptionist, booking automation, review intelligence and Voice of Customer reports.",
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
