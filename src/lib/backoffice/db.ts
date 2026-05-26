import { createClient } from "@supabase/supabase-js";

/** Service-role Supabase client for backoffice tables (server-only). */
export function getBackofficeDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}
