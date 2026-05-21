export type ServiceTab = "ai" | "voc";

/** Which in-page id to scroll to for services hashes (tabs mount lazily). */
export function scrollTargetFromHash(hash: string): string | null {
  if (hash === "#ai-receptionist") return "ai-receptionist";
  if (hash === "#industry-demos") return "industry-demos";
  if (hash === "#voice-of-customer" || hash === "#voc") return "voice-of-customer";
  if (hash === "#voc-demos") return "voc-demos";
  return null;
}

export function serviceTabFromHash(hash: string): ServiceTab {
  if (hash === "#ai-receptionist" || hash === "#industry-demos") {
    return "ai";
  }
  if (
    hash === "#voice-of-customer" ||
    hash === "#voc" ||
    hash === "#voc-demos"
  ) {
    return "voc";
  }
  return "voc";
}

/** Scroll to an in-page anchor, retrying while lazy-mounted UI (e.g. tab panels) renders. */
export function scrollToAnchor(
  id: string,
  options?: { behavior?: ScrollBehavior; maxAttempts?: number; intervalMs?: number }
) {
  const behavior = options?.behavior ?? "smooth";
  const maxAttempts = options?.maxAttempts ?? 16;
  const intervalMs = options?.intervalMs ?? 50;

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior, block: "start" });
    return true;
  };

  if (tryScroll()) return;

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (tryScroll() || attempts >= maxAttempts) {
      window.clearInterval(timer);
    }
  }, intervalMs);
}

export function setLocationHash(hash: string) {
  const normalized = hash.startsWith("#") ? hash : `#${hash}`;
  if (window.location.hash === normalized) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = normalized.slice(1);
}
