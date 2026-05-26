/** Bump `version` when replacing `public/seprator.png` so browsers skip stale copies. */
const ABOUT_SEPARATOR = {
  path: "/seprator.png",
  version: "2025-05-26",
  width: 1922,
  height: 535,
} as const;

export const aboutSeparatorSrc = `${ABOUT_SEPARATOR.path}?v=${ABOUT_SEPARATOR.version}`;
export const aboutSeparatorWidth = ABOUT_SEPARATOR.width;
export const aboutSeparatorHeight = ABOUT_SEPARATOR.height;
