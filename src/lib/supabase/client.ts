import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const LOGIN_REMEMBER_KEY = "ringsaway-login-remember";
export const LOGIN_EMAIL_KEY = "ringsaway-login-email";

export function createClient(options?: { rememberMe?: boolean }) {
  const remember = options?.rememberMe ?? true;

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: remember
        ? { maxAge: REMEMBER_ME_MAX_AGE, sameSite: "lax", path: "/" }
        : { sameSite: "lax", path: "/" },
    }
  );
}
