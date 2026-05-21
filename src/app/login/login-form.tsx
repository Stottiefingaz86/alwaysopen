"use client";

import {
  createClient,
  LOGIN_EMAIL_KEY,
  LOGIN_REMEMBER_KEY,
} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass = cn(
  "mt-1.5 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus-visible:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/20"
);

function readRememberPreference(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(LOGIN_REMEMBER_KEY);
  return stored !== "false";
}

function readSavedEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRememberMe(readRememberPreference());
    setEmail(readSavedEmail());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem(LOGIN_REMEMBER_KEY, rememberMe ? "true" : "false");
      if (rememberMe) {
        localStorage.setItem(LOGIN_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(LOGIN_EMAIL_KEY);
      }
    }

    const supabase = createClient({ rememberMe });
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    const { data: allowed } = await supabase.rpc("is_admin");
    if (!allowed) {
      await supabase.auth.signOut();
      setError("This account is not authorised for admin access.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={fieldClass}
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={fieldClass}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="size-4 rounded border-google-gray-300 text-google-blue focus-visible:ring-2 focus-visible:ring-google-blue/30"
        />
        <span className="text-sm text-google-gray-600">
          Remember me for 30 days
        </span>
      </label>
      {error ? (
        <p className="text-sm text-google-red" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
