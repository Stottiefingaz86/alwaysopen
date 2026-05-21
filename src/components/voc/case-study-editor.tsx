"use client";

import { Button } from "@/components/ui/button";
import {
  BUSINESS_TAG_OPTIONS,
  formatTagLabel,
  normalizeBusinessTags,
} from "@/lib/voc/business-tags";
import { SetupCaseStudiesCallout } from "@/components/voc/setup-case-studies-callout";
import { DEFAULT_CASE_STUDY_PLACEMENTS } from "@/lib/voc/case-studies";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe, GlobeOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type CaseStudyEditorProps = {
  reportId: string;
  businessName: string;
  businessTags: string[];
  disabled?: boolean;
  onPublishedChange?: () => void;
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
  onPublishedChange,
}: CaseStudyEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [published, setPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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
      if (row?.is_published) {
        setPublished(true);
        setTitle(row.title ?? "");
        setTags(row.tags?.length ? row.tags : businessTags);
        setSortOrder(row.sort_order ?? 0);
      } else {
        setPublished(false);
        setTitle("");
        setTags(businessTags.length ? [...businessTags] : ["restaurant"]);
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

  async function save(publish: boolean) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          title: title.trim() || null,
          tags: normalizeBusinessTags(tags),
          placements: [...DEFAULT_CASE_STUDY_PLACEMENTS],
          sort_order: sortOrder,
          is_published: publish,
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
      setPublished(publish);
      if (publish) setExpanded(false);
      onPublishedChange?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeFromWebsite() {
    setRemoving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/case-studies?report_id=${encodeURIComponent(reportId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Remove failed");
      }
      setPublished(false);
      setExpanded(false);
      onPublishedChange?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    } finally {
      setRemoving(false);
    }
  }

  if (loading) {
    return (
      <p className="mt-3 text-xs text-google-gray-500">Loading landing settings…</p>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-google-gray-200 bg-google-gray-50/60">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-google-gray-500 transition-transform",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
          <span className="text-xs font-medium text-foreground">Landing case study</span>
          {published ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-google-green/10 px-2 py-0.5 text-[10px] font-medium text-google-green">
              <Globe className="size-3" aria-hidden />
              On website
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-google-gray-100 px-2 py-0.5 text-[10px] font-medium text-google-gray-600">
              <GlobeOff className="size-3" aria-hidden />
              Hidden
            </span>
          )}
        </button>

        {published ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 shrink-0 border-google-red/30 text-xs text-google-red hover:bg-google-red/5"
            disabled={disabled || removing}
            onClick={() => void removeFromWebsite()}
          >
            {removing ? "Removing…" : "Remove from website"}
          </Button>
        ) : null}
      </div>

      {!expanded && published ? (
        <p className="border-t border-google-gray-100 px-3 py-2 text-[11px] text-google-gray-500">
          {title.trim() || businessName}
          {tags.length > 0 ? ` · ${tags.map(formatTagLabel).join(", ")}` : ""}
        </p>
      ) : null}

      {expanded ? (
        <div className="space-y-3 border-t border-google-gray-100 px-3 py-3">
          <p className="text-[11px] text-google-gray-500">
            Homepage VoC cards — visitors see a preview, then contact you for the full report.
          </p>

          {tableMissing ? (
            <SetupCaseStudiesCallout onFixed={() => void loadCaseStudy()} />
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-google-gray-700">
                  Card title (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-1.5 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={businessName}
                  disabled={disabled}
                />
              </div>

              <div>
                <span className="text-xs font-medium text-google-gray-700">Filter tags</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {BUSINESS_TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
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
                <label className="text-xs font-medium text-google-gray-700">Sort order</label>
                <input
                  type="number"
                  className="mt-1 w-20 rounded-lg border border-google-gray-200 bg-white px-2 py-1.5 text-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                  disabled={disabled}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  disabled={disabled || saving || tableMissing}
                  onClick={() => void save(true)}
                >
                  {saving ? "Saving…" : published ? "Save changes" : "Publish on website"}
                </Button>
                {!published ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled || saving || tableMissing}
                    onClick={() => setExpanded(false)}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}

      {!expanded && !published && !tableMissing ? (
        <div className="border-t border-google-gray-100 px-3 py-2">
          <button
            type="button"
            className="text-xs font-medium text-google-blue hover:underline"
            disabled={disabled}
            onClick={() => setExpanded(true)}
          >
            Configure & publish on website
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="border-t border-google-gray-100 px-3 py-2 text-xs text-google-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
