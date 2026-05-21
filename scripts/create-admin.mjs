#!/usr/bin/env node
/**
 * Creates the allowlisted admin user in Supabase Auth.
 * Loads .env.local when present. Requires SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node scripts/create-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL ?? "christopher.hunt86@gmail.com";
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!password || password.length < 12) {
  console.error("Set ADMIN_PASSWORD (min 12 characters)");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 200 });
const found = existing?.users?.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase()
);

if (found) {
  const { error } = await supabase.auth.admin.updateUserById(found.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }
  console.log(`Updated password for ${email}`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Create failed:", error.message);
    process.exit(1);
  }
  console.log(`Created admin user ${email}`);
}

console.log("User must be in public.admin_allowlist (migration already seeds your email).");
