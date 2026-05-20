"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "blue" | "pattern";
}

const backgrounds = {
  white: "bg-white",
  gray: "bg-google-gray-50",
  blue: "bg-pastel-blue",
  pattern: "bg-google-gray-50 relative overflow-x-clip",
};

export function Section({
  id,
  children,
  className,
  background = "white",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(backgrounds[background], "py-20 md:py-28", className)}
    >
      {background === "pattern" && (
        <div className="pattern-dots pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      )}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mb-4 inline-block text-xs font-medium uppercase tracking-[0.12em] text-google-blue",
        className
      )}
    >
      {children}
    </span>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  eyebrow?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("mb-14 md:mb-20", centered && "text-center")}
    >
      {eyebrow && (
        <SectionEyebrow className={centered ? "block" : undefined}>
          {eyebrow}
        </SectionEyebrow>
      )}
      <h2 className="text-balance text-2xl font-normal leading-snug tracking-tight text-foreground sm:text-3xl md:text-[2.125rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-google-gray-500 md:text-lg md:leading-8">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
