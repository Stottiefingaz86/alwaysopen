export type ReviewSourceKey = "google" | "trustpilot" | "tripadvisor";

/** Public asset paths for review platform logos */
export const REVIEW_SOURCE_ICON_PATH: Record<ReviewSourceKey, string> = {
  google: "/google-my-business-icon.svg",
  trustpilot: "/trustpiliot.png",
  tripadvisor: "/tripadvisor.png",
};

export function reviewSourceIconPath(source: string): string {
  if (source === "trustpilot") return REVIEW_SOURCE_ICON_PATH.trustpilot;
  if (source === "tripadvisor") return REVIEW_SOURCE_ICON_PATH.tripadvisor;
  return REVIEW_SOURCE_ICON_PATH.google;
}

export const REVIEW_SOURCE_KEYS: ReviewSourceKey[] = [
  "google",
  "trustpilot",
  "tripadvisor",
];

export type ReviewSourceLabels = Record<ReviewSourceKey, string>;

export function reviewSourceLabel(
  source: string,
  labels: ReviewSourceLabels
): string {
  if (source === "tripadvisor") return labels.tripadvisor;
  if (source === "trustpilot") return labels.trustpilot;
  return labels.google;
}
