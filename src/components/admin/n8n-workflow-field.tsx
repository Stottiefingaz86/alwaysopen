"use client";

import { parseN8nWorkflowId } from "@/lib/n8n-url";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

const inputClass = cn(
  "mt-1 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
);

const labelClass = "text-xs font-medium uppercase tracking-wide text-google-gray-500";

type N8nWorkflowOption = {
  id: string;
  name: string;
  active: boolean;
  editorUrl: string;
};

export function N8nWorkflowField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const [workflows, setWorkflows] = useState<N8nWorkflowOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/backoffice/n8n/workflows");
      const json = (await res.json()) as {
        workflows?: N8nWorkflowOption[];
        error?: string | null;
        configured?: boolean;
      };
      if (!res.ok) {
        setLoadError(json.error ?? "Could not load workflows");
        return;
      }
      setWorkflows(json.workflows ?? []);
      if (json.error) setLoadError(json.error);
      setLoaded(true);
    } catch {
      setLoadError("Could not load workflows");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loaded) return;
    void loadWorkflows();
  }, [loaded, loadWorkflows]);

  function onPick(workflowId: string) {
    const wf = workflows.find((w) => w.id === workflowId);
    if (wf) onChange(wf.editorUrl);
  }

  function onPasteBlur() {
    const id = parseN8nWorkflowId(value);
    if (!id || value.includes("/workflow/")) return;
    const wf = workflows.find((w) => w.id === id);
    if (wf) onChange(wf.editorUrl);
  }

  const matchedId = parseN8nWorkflowId(value);

  return (
    <div className="sm:col-span-2 rounded-xl border border-google-gray-100 bg-google-gray-50/50 p-4">
      <label className={labelClass}>{label}</label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
        <input
          className={cn(inputClass, "mt-0 flex-1")}
          disabled={disabled}
          value={value}
          placeholder="https://your-instance.app.n8n.cloud/workflow/…"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onPasteBlur}
        />
        <select
          className={cn(inputClass, "mt-0 sm:max-w-xs")}
          disabled={disabled || loading || workflows.length === 0}
          value={matchedId ?? ""}
          onChange={(e) => onPick(e.target.value)}
        >
          <option value="">
            {loading ? "Loading n8n…" : workflows.length ? "Pick workflow…" : "No workflows"}
          </option>
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>
              {w.active ? "● " : "○ "}
              {w.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => {
            setLoaded(false);
            void loadWorkflows();
          }}
          className="shrink-0 rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-xs text-google-gray-600 hover:bg-google-gray-50"
        >
          Refresh
        </button>
      </div>
      {loadError ? (
        <p className="mt-2 text-xs text-amber-800">
          {loadError}. Add <code className="text-[11px]">N8N_API_BASE_URL</code> and{" "}
          <code className="text-[11px]">N8N_API_KEY</code> on the server, or paste the editor URL
          from n8n manually.
        </p>
      ) : (
        <p className="mt-2 text-xs text-google-gray-500">
          Use the editor link (workflow page in n8n), not the webhook URL. Example:{" "}
          <span className="font-mono text-[11px]">…/workflow/mzpH8ceGar3qjnuN</span>
        </p>
      )}
    </div>
  );
}
