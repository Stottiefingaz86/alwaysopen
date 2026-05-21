"use client";

import { Button } from "@/components/ui/button";
import { CASE_STUDIES_MIGRATION_SQL } from "@/lib/supabase/case-studies-migration-sql";
import { useState } from "react";

const PROJECT_REF = "aierpcwlkmvyojnaksvr";
const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

export function SetupCaseStudiesCallout({ onFixed }: { onFixed?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function copySql() {
    void navigator.clipboard.writeText(CASE_STUDIES_MIGRATION_SQL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function tryApplyFromApp() {
    setApplying(true);
    setMessage(null);
    const res = await fetch("/api/admin/voc/apply-case-studies-migration", {
      method: "POST",
    });
    const json = await res.json().catch(() => ({}));
    setApplying(false);
    if (json.ok) {
      setMessage("Table created. Refreshing…");
      setTimeout(() => onFixed?.(), 1500);
      return;
    }
    setMessage(
      json.error ??
        "Could not apply automatically. Copy the SQL below into Supabase SQL Editor."
    );
  }

  return (
    <div className="rounded-xl border-2 border-google-red/30 bg-google-red/5 p-4">
      <h3 className="text-sm font-medium text-google-red">Landing reports need a database table</h3>
      <p className="mt-2 text-xs leading-relaxed text-google-gray-700">
        One-time setup: create <code className="text-[10px]">voc_case_studies</code> so you can
        publish reports to the homepage VoC section.
      </p>

      <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-xs text-google-gray-700">
        <li>
          Open{" "}
          <a
            href={SQL_EDITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-google-blue hover:underline"
          >
            Supabase SQL Editor
          </a>
          .
        </li>
        <li>
          <strong>Copy SQL</strong> → paste → <strong>Run</strong>.
        </li>
        <li>
          Wait 10 seconds, then <strong>I ran this — refresh</strong>.
        </li>
      </ol>

      <pre className="mt-3 max-h-32 overflow-auto rounded-lg border border-google-gray-200 bg-white p-2 text-[10px] text-google-gray-800">
        {CASE_STUDIES_MIGRATION_SQL}
      </pre>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copySql}>
          {copied ? "Copied" : "Copy SQL"}
        </Button>
        <a
          href={SQL_EDITOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-google-gray-200 bg-white px-3 text-xs font-medium hover:bg-google-gray-50"
        >
          Open SQL Editor
        </a>
        <Button type="button" size="sm" onClick={() => void tryApplyFromApp()} disabled={applying}>
          {applying ? "Applying…" : "Try auto-apply"}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => onFixed?.()}>
          I ran this — refresh
        </Button>
      </div>

      {message ? (
        <p className="mt-2 text-xs text-google-gray-600" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
