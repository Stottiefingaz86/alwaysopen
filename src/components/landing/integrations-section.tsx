"use client";

import { FadeIn, Section, SectionHeader } from "@/components/ui/section";
import { IntegrationBrandIcon } from "@/components/landing/integration-icon";
import { getIntegrationItems } from "@/lib/integrations";
import type { Messages } from "@/lib/i18n/messages/en";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const integrationItems = getIntegrationItems();

function integrationLabels(
  categories: Messages["integrations"]["categories"]
): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const category of Object.values(categories)) {
    Object.assign(labels, category.items);
  }
  return labels;
}

export function IntegrationsSection() {
  const { m } = useLocale();
  const copy = m.integrations;
  const labels = integrationLabels(copy.categories);

  return (
    <Section id="integrations" background="pattern" className="py-14 md:py-20">
      <SectionHeader
        compact
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <FadeIn>
        <ul
          className={cn(
            "mx-auto grid max-w-3xl grid-cols-3 gap-2.5 sm:max-w-4xl sm:grid-cols-4 sm:gap-3",
            "md:grid-cols-5 lg:grid-cols-7"
          )}
        >
            {integrationItems.map((item, index) => {
              const name = labels[item.id];
              if (!name) return null;

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ delay: index * 0.03, duration: 0.35 }}
                  className={cn(
                    "group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl",
                    "border border-google-gray-200/90 bg-white/95 p-2.5 shadow-google",
                    "backdrop-blur-sm transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-google-blue/30 hover:shadow-google-md"
                  )}
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-google-gray-50 transition-colors group-hover:bg-pastel-blue/40 sm:size-10">
                    <IntegrationBrandIcon icon={item.icon} label={name} size={22} />
                  </span>
                  <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-google-gray-600 sm:text-[11px]">
                    {name}
                  </span>
                </motion.li>
              );
            })}
        </ul>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-google-gray-500">
          {copy.footnote}
        </p>
      </FadeIn>
    </Section>
  );
}
