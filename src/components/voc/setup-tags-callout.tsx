"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const PROJECT_REF = "aierpcwlkmvyojnaksvr";

const TAGS_SQL = `ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';`;

const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

export function SetupTagsCallout({ onFixed }: { onFixed?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function copySql() {
    void navigator.clipboard.writeText(TAGS_SQL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function tryApplyFromApp() {
    setApplying(true);
    setMessage(null);
    const res = await fetch("/api/admin/voc/apply-tags-migration", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    setApplying(false);
    if (json.ok) {
      setMessage("Column added. Refreshing…");
      setTimeout(() => onFixed?.(), 1500);
      return;
    }
    setMessage(json.error ?? "Could not apply automatically. Use the SQL Editor steps below.");
  }

  return (
    <div className="rounded-2xl border-2 border-google-red/30 bg-google-red/5 p-5">
      <h2 className="text-base font-medium text-google-red">Database setup required</h2>
      <p className="mt-2 text-sm leading-relaxed text-google-gray-700">
        Tags and area benchmarking need a <code className="text-xs">tags</code> column on{" "}
        <code className="text-xs">businesses</code>. This is a one-time fix in Supabase (about 30
        seconds).
      </p>

      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-google-gray-700">
        <li>
          Open{" "}
          <a
            href={SQL_EDITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-google-blue hover:underline"
          >
            Supabase SQL Editor
          </a>{" "}
          for this project.
        </li>
        <li>
          Click <strong>Copy SQL</strong> below, paste into the editor, and press{" "}
          <strong>Run</strong>.
        </li>
        <li>Wait 10 seconds, then click <strong>I ran this — refresh</strong>.</li>
      </ol>

      <pre className="mt-4 overflow-x-auto rounded-lg border border-google-gray-200 bg-white p-3 text-xs text-google-gray-800">
        {TAGS_SQL}
      </pre>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copySql}>
          {copied ? "Copied" : "Copy SQL"}
        </Button>
        <a
          href={SQL_EDITOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-google-gray-200 bg-white px-3 text-sm font-medium hover:bg-google-gray-50"
        >
          Open SQL Editor
        </a>
        <Button type="button" size="sm" onClick={() => void tryApplyFromApp()} disabled={applying}>
          {applying ? "Applying…" : "Try auto-apply (needs SUPABASE_DB_URL)"}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => onFixed?.()}>
          I ran this — refresh
        </Button>
      </div>

      {message ? (
        <p className="mt-3 text-sm text-google-gray-600" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
