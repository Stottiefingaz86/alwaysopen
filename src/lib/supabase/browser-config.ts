import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;

export type SupabaseBrowserConfig = {
  url: string;
  anonKey: string;
};

let cached: SupabaseBrowserConfig | null = null;
let inflight: Promise<SupabaseBrowserConfig | null> | null = null;

function fromBuildEnv(): SupabaseBrowserConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url?.startsWith("https://") || !anonKey || anonKey.length < 20) {
    return null;
  }
  return { url, anonKey };
}

/** Baked env at build, or `/api/config/supabase` at runtime on Vercel. */
export async function getSupabaseBrowserConfig(): Promise<SupabaseBrowserConfig | null> {
  if (cached) return cached;

  const baked = fromBuildEnv();
  if (baked) {
    cached = baked;
    return baked;
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch("/api/config/supabase", { cache: "no-store" });
      const json = (await res.json()) as {
        configured?: boolean;
        url?: string;
        anonKey?: string;
      };
      if (json.configured && json.url && json.anonKey) {
        cached = { url: json.url, anonKey: json.anonKey };
        return cached;
      }
    } catch {
      /* ignore */
    }
    return null;
  })();

  const result = await inflight;
  inflight = null;
  return result;
}

export function createBrowserSupabase(
  config: SupabaseBrowserConfig,
  options?: { rememberMe?: boolean }
) {
  const remember = options?.rememberMe ?? true;
  return createBrowserClient<Database>(config.url, config.anonKey, {
    cookieOptions: remember
      ? { maxAge: REMEMBER_ME_MAX_AGE, sameSite: "lax", path: "/" }
      : { sameSite: "lax", path: "/" },
  });
}

export function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}
