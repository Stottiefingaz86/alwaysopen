"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://calendar.google.com/calendar/scheduling-button-script.js";
const STYLESHEET_HREF =
  "https://calendar.google.com/calendar/scheduling-button-script.css";

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (options: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

type GoogleCalendarSchedulingButtonProps = {
  scheduleUrl: string;
  label: string;
  /** Google default is #039BE5; RingsAway blue */
  color?: string;
  className?: string;
};

function ensureStylesheet() {
  if (document.querySelector(`link[href="${STYLESHEET_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = STYLESHEET_HREF;
  document.head.appendChild(link);
}

function loadSchedulingScript(): Promise<void> {
  if (window.calendar?.schedulingButton) {
    return Promise.resolve();
  }

  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => {
      if (window.calendar?.schedulingButton) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Calendar scheduling script"));
    document.head.appendChild(script);
  });
}

/** Official Google Calendar appointment button (opens booking popup). */
export function GoogleCalendarSchedulingButton({
  scheduleUrl,
  label,
  color = "#3b7fd4",
  className,
}: GoogleCalendarSchedulingButtonProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !scheduleUrl) return;

    let cancelled = false;

    void (async () => {
      try {
        ensureStylesheet();
        await loadSchedulingScript();
        if (cancelled || !window.calendar?.schedulingButton) return;
        window.calendar.schedulingButton.load({
          url: scheduleUrl,
          color,
          label,
          target,
        });
      } catch {
        /* fallback: parent can show alternate CTA */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scheduleUrl, label, color]);

  return (
    <div
      ref={targetRef}
      className={className}
      data-google-scheduling-button
    />
  );
}
