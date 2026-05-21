import {
  createBrowserSupabase,
  getSupabaseBrowserConfig,
  type SupabaseBrowserConfig,
} from "@/lib/supabase/browser-config";

export const LOGIN_REMEMBER_KEY = "ringsaway-login-remember";
export const LOGIN_EMAIL_KEY = "ringsaway-login-email";

export { getSupabaseBrowserConfig, createBrowserSupabase };

/** Prefer async `getSupabaseBrowserConfig` + `createBrowserSupabase` in the browser. */
export function createClient(options?: { rememberMe?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url?.startsWith("https://") || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  return createBrowserSupabase({ url, anonKey: key }, options);
}

export function createClientWithConfig(
  config: SupabaseBrowserConfig,
  options?: { rememberMe?: boolean }
) {
  return createBrowserSupabase(config, options);
}
