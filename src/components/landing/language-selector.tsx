"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { localeNames, locales, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

const flagSrc: Record<Locale, string> = {
  en: "/flags/gb.svg",
  es: "/flags/es.svg",
};

function CircleFlag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Image
      src={flagSrc[locale]}
      alt=""
      width={24}
      height={24}
      className={cn("size-6 shrink-0 rounded-full ring-1 ring-black/10", className)}
      aria-hidden
    />
  );
}

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const select = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-google-gray-200 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-google-gray-700 shadow-google transition-colors",
          "hover:border-google-blue/35 hover:text-google-blue",
          open && "border-google-blue/40 ring-2 ring-google-blue/20"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${localeNames[locale]}`}
      >
        <CircleFlag locale={locale} />
        <ChevronDown
          className={cn("size-4 shrink-0 text-google-gray-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[168px] overflow-hidden rounded-xl border border-google-gray-200 bg-white py-1 shadow-google-elevated"
        >
          {locales.map((code) => {
            const selected = locale === code;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                    selected
                      ? "bg-pastel-blue/60 text-google-blue"
                      : "text-google-gray-700 hover:bg-google-gray-50"
                  )}
                >
                  <CircleFlag locale={code} />
                  <span className="flex-1 font-medium">{localeNames[code]}</span>
                  {selected && <Check className="size-4 shrink-0 text-google-blue" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
