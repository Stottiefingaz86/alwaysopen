#!/usr/bin/env node
/**
 * Creates public.voc_case_studies for landing report cards.
 * Preferred: Supabase Dashboard → SQL Editor (copy SQL below).
 *
 * Optional: SUPABASE_DB_URL in .env.local → auto-apply via pg
 * Optional CLI: npx supabase db execute --project-ref REF -f supabase/migrations/20260521120000_voc_case_studies.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20260521120000_voc_case_studies.sql"
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

const sql = readFileSync(migrationPath, "utf8");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log("\n=== Create voc_case_studies table ===\n");
console.log("Run in Supabase Dashboard → SQL Editor:\n");
console.log(sql);
console.log("\n");

if (process.env.SUPABASE_DB_URL) {
  console.log("Applying via SUPABASE_DB_URL…\n");
  const { default: pg } = await import("pg");
  const client = new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log("Done. Reload dashboard and Save case study again.\n");
    process.exit(0);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    console.error("\nUse SQL Editor above.\n");
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

if (projectRef && process.env.SUPABASE_ACCESS_TOKEN) {
  console.log(`Attempting CLI for project ${projectRef}…\n`);
  const r = spawnSync(
    "npx",
    ["supabase", "db", "execute", "--project-ref", projectRef, "-f", migrationPath],
    { stdio: "inherit", env: process.env }
  );
  if (r.status === 0) {
    console.log("\nDone.\n");
    process.exit(0);
  }
}

console.log(
  "Tip: add SUPABASE_DB_URL to .env.local (Transaction pooler URI) and re-run this script.\n"
);
process.exit(0);
