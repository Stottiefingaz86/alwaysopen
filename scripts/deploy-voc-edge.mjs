#!/usr/bin/env node
/**
 * Deploy generate-voc-report with all _shared modules.
 * Requires: npx supabase login
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

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
const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "aierpcwlkmvyojnaksvr";

console.log(`Deploying generate-voc-report to ${projectRef}...\n`);

const r = spawnSync(
  "npx",
  ["supabase", "functions", "deploy", "generate-voc-report", "--no-verify-jwt", "--project-ref", projectRef],
  { stdio: "inherit", env: process.env, cwd: process.cwd() }
);

process.exit(r.status === 0 ? 0 : 1);
