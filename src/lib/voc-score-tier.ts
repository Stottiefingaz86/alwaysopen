export type VocScoreTier = "great" | "good" | "fair" | "bad";

/** VoC score bands: great ≥80, good ≥70, fair ≥50, bad <50 */
export function getVocScoreTier(score: number): VocScoreTier {
  if (score >= 80) return "great";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "bad";
}

export function getVocScoreTierStyles(tier: VocScoreTier) {
  const styles: Record<
    VocScoreTier,
    { box: string; label: string; arc: string }
  > = {
    great: {
      box: "border-google-green/35 bg-google-green/8",
      label: "text-google-green",
      arc: "var(--google-green)",
    },
    good: {
      box: "border-violet-200 bg-violet-50",
      label: "text-violet-700",
      arc: "#7c6dae",
    },
    fair: {
      box: "border-google-gray-200 bg-google-gray-50",
      label: "text-google-gray-600",
      arc: "var(--google-gray-400)",
    },
    bad: {
      box: "border-google-red/35 bg-google-red/8",
      label: "text-google-red",
      arc: "var(--google-red)",
    },
  };

  return styles[tier];
}
