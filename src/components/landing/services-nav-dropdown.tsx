"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { setLocationHash } from "@/lib/hash-navigation";
import { cn } from "@/lib/utils";
import { Bot, ChevronDown, FileText } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type ServicesNavDropdownProps = {
  sectionLink: (hash: string) => string;
  /** When true, use hash routing on the homepage instead of full navigation */
  onHome?: boolean;
  className?: string;
  onNavigate?: () => void;
};

export function ServicesNavDropdown({
  sectionLink,
  onHome = false,
  className,
  onNavigate,
}: ServicesNavDropdownProps) {
  const { m } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const items = [
    {
      hash: "#ai-receptionist",
      href: sectionLink("#ai-receptionist"),
      label: m.nav.serviceAi,
      icon: Bot,
      description: m.solution.tabs.ai,
    },
    {
      hash: "#voice-of-customer",
      href: sectionLink("#voice-of-customer"),
      label: m.nav.serviceVoc,
      icon: FileText,
      description: m.solution.tabs.voc,
    },
  ] as const;

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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 text-sm text-google-gray-700 transition-colors hover:text-google-blue",
          open && "text-google-blue"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
      >
        {m.nav.services}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 min-w-[15.5rem] overflow-hidden rounded-xl border border-google-gray-200 bg-white py-1 shadow-google-elevated"
        >
          {items.map((item) => (
            <li key={item.href} role="none">
              <a
                href={item.href}
                role="menuitem"
                className="flex gap-3 px-3 py-2.5 transition-colors hover:bg-google-gray-50"
                onClick={(e) => {
                  setOpen(false);
                  onNavigate?.();
                  if (onHome) {
                    e.preventDefault();
                    setLocationHash(item.hash);
                  }
                }}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pastel-blue text-google-blue">
                  <item.icon className="size-4" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="block text-xs text-google-gray-500">
                    {item.description}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
