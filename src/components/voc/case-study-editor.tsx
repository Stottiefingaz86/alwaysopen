"use client";

import { Button } from "@/components/ui/button";
import {
  BUSINESS_TAG_OPTIONS,
  formatTagLabel,
  normalizeBusinessTags,
} from "@/lib/voc/business-tags";
import { SetupCaseStudiesCallout } from "@/components/voc/setup-case-studies-callout";
import {
  CASE_STUDY_PLACEMENTS,
  DEFAULT_CASE_STUDY_PLACEMENTS,
  normalizePlacements,
  type CaseStudyPlacement,
} from "@/lib/voc/case-studies";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type CaseStudyEditorProps = {
  reportId: string;
  businessName: string;
  businessTags: string[];
  disabled?: boolean;
};

type CaseStudyRow = {
  report_id: string;
  title: string | null;
  tags: string[];
  placements: string[];
  sort_order: number;
  is_published: boolean;
};

export function CaseStudyEditor({
  reportId,
  businessName,
  businessTags,
  disabled,
}: CaseStudyEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [placements, setPlacements] = useState<CaseStudyPlacement[]>([
    ...DEFAULT_CASE_STUDY_PLACEMENTS,
  ]);
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  const loadCaseStudy = useCallback(async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const res = await fetch("/api/admin/case-studies");
      const json = (await res.json()) as {
        items?: CaseStudyRow[];
        error?: string;
        needsMigration?: boolean;
      };
      if (!res.ok) {
        if (json.needsMigration || res.status === 503) {
          setTableMissing(true);
          setError(null);
          return;
        }
        throw new Error(json.error ?? "Could not load case studies");
      }
      const row = json.items?.find((i) => i.report_id === reportId);
      if (row) {
        setEnabled(true);
        setTitle(row.title ?? "");
        setTags(row.tags?.length ? row.tags : businessTags);
        setPlacements(normalizePlacements(row.placements));
        setSortOrder(row.sort_order ?? 0);
      } else {
        setEnabled(false);
        setTags(businessTags.length ? [...businessTags] : ["restaurant"]);
        setPlacements([...DEFAULT_CASE_STUDY_PLACEMENTS]);
        setSortOrder(0);
      }
    } catch {
      setTags(businessTags.length ? [...businessTags] : []);
    } finally {
      setLoading(false);
    }
  }, [reportId, businessTags]);

  useEffect(() => {
    void loadCaseStudy();
  }, [loadCaseStudy]);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function togglePlacement(id: CaseStudyPlacement) {
    setPlacements((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((p) => p !== id);
        return next.length ? next : [id];
      }
      return [...prev, id];
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!enabled) {
        const res = await fetch(
          `/api/admin/case-studies?report_id=${encodeURIComponent(reportId)}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "Remove failed");
        }
        return;
      }

      const res = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          title: title.trim() || null,
          tags: normalizeBusinessTags(tags),
          placements: normalizePlacements(placements),
          sort_order: sortOrder,
          is_published: true,
        }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        error?: string;
        needsMigration?: boolean;
      };
      if (!res.ok) {
        if (j.needsMigration || res.status === 503) {
          setTableMissing(true);
          setError(null);
          return;
        }
        throw new Error(j.error ?? "Save failed");
      }
      setTableMissing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mt-3 text-xs text-google-gray-500">Loading case study…</p>;
  }

  return (
    <div className="mt-4 rounded-xl border border-google-gray-200 bg-google-gray-50/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Landing case study</p>
        <label className="flex items-center gap-2 text-xs text-google-gray-600">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={disabled}
          />
          Show on website
        </label>
      </div>
      <p className="mt-1 text-xs text-google-gray-500">
        Appears in the VoC reports row on the homepage (same card layout as samples). Visitors
        open a preview with &ldquo;Get full report&rdquo;.
      </p>

      {tableMissing ? (
        <div className="mt-4">
          <SetupCaseStudiesCallout onFixed={() => void loadCaseStudy()} />
        </div>
      ) : null}

      {enabled && !tableMissing ? (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-google-gray-700">
              Card title (optional)
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-google-gray-200 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={businessName}
              disabled={disabled}
            />
          </div>

          <div>
            <span className="text-xs font-medium text-google-gray-700">Filter tags</span>
            <p className="mt-0.5 text-[10px] text-google-gray-500">
              Used for carousel filters (e.g. Restaurant, Sotogrande).
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUSINESS_TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium",
                    tags.includes(tag)
                      ? "border-google-blue bg-pastel-blue text-google-blue"
                      : "border-google-gray-200 bg-white text-google-gray-600"
                  )}
                >
                  {formatTagLabel(tag)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-google-gray-700">Show on</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CASE_STUDY_PLACEMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => togglePlacement(p.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium",
                    placements.includes(p.id)
                      ? "border-google-blue bg-white text-google-blue"
                      : "border-google-gray-200 bg-white text-google-gray-600"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-google-gray-700">Sort order</label>
            <input
              type="number"
              className="mt-1 w-24 rounded-lg border border-google-gray-200 px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              disabled={disabled}
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-xs text-google-red" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        size="sm"
        className="mt-4"
        disabled={disabled || saving || tableMissing}
        onClick={() => void save()}
      >
        {saving ? "Saving…" : enabled ? "Save case study" : "Remove from website"}
      </Button>
    </div>
  );
}
