#!/usr/bin/env node
/**
 * Adds businesses.tags for area benchmarking.
 * Preferred: paste SQL in Supabase Dashboard → SQL Editor (always works).
 *
 * Optional CLI (after `npx supabase login`):
 *   npx supabase db execute --project-ref YOUR_REF -f supabase/migrations/20260520120000_business_tags.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const SQL = `ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';`;

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20260520120000_business_tags.sql"
);

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i);
    const value = trimmed.slice(i + 1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log("\n=== Add businesses.tags column ===\n");
console.log("Run this in Supabase Dashboard → SQL Editor → Run:\n");
console.log(SQL);
console.log("\nThen wait ~10 seconds for the API schema cache to refresh.\n");

if (projectRef && process.env.SUPABASE_ACCESS_TOKEN) {
  console.log(`Attempting CLI apply for project ${projectRef}...\n`);
  const r = spawnSync(
    "npx",
    [
      "supabase",
      "db",
      "execute",
      "--project-ref",
      projectRef,
      "-f",
      migrationPath,
    ],
    { stdio: "inherit", env: process.env }
  );
  if (r.status === 0) {
    console.log("\nDone. Reload the dashboard and save tags again.\n");
    process.exit(0);
  }
  console.error("\nCLI failed — use SQL Editor above.\n");
  process.exit(1);
}

if (projectRef) {
  console.log(
    `Or: npx supabase login && npx supabase db execute --project-ref ${projectRef} -f supabase/migrations/20260520120000_business_tags.sql\n`
  );
}

process.exit(0);
