function separatorSrc(path: string, version: string) {
  return `${path}?v=${version}`;
}

/** Bump `version` when replacing `public/seprator.png` so browsers skip stale copies. */
const ABOUT_SEPARATOR = {
  path: "/seprator.png",
  version: "2025-05-26",
  width: 1922,
  height: 535,
} as const;

export const aboutSeparatorSrc = separatorSrc(
  ABOUT_SEPARATOR.path,
  ABOUT_SEPARATOR.version
);
export const aboutSeparatorWidth = ABOUT_SEPARATOR.width;
export const aboutSeparatorHeight = ABOUT_SEPARATOR.height;

/** Bump `version` when replacing `public/2NDSEPERATOR.png`. */
const STATS_SEPARATOR = {
  path: "/2NDSEPERATOR.png",
  version: "2025-05-26-2",
  width: 1920,
  height: 323,
} as const;

export const statsSeparatorSrc = separatorSrc(
  STATS_SEPARATOR.path,
  STATS_SEPARATOR.version
);
export const statsSeparatorWidth = STATS_SEPARATOR.width;
export const statsSeparatorHeight = STATS_SEPARATOR.height;

/** Bump `version` when replacing the AI receptionist demo video in `public/`. */
const AI_RECEPTIONIST_VIDEO = {
  path: "/runway-agent-already-got-you-20260602-180214.mp4",
  version: "2026-06-02",
} as const;

export const aiReceptionistVideoSrc = `${AI_RECEPTIONIST_VIDEO.path}?v=${AI_RECEPTIONIST_VIDEO.version}`;
