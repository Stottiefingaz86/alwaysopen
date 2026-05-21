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
