"use client";

import { Logo } from "@/components/landing/logo";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/workflows", label: "Workflows", icon: Workflow },
  { href: "/admin/reports", label: "VoC reports", icon: FileBarChart },
  { href: "/admin/usage", label: "Usage", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  userEmail,
  title,
}: {
  children: React.ReactNode;
  userEmail: string;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-google-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-google-gray-200 bg-white lg:flex">
        <div className="border-b border-google-gray-100 px-5 py-5">
          <Logo />
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-google-blue">
            Backoffice
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-pastel-blue text-google-blue"
                    : "text-google-gray-600 hover:bg-google-gray-50 hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-dashed border-google-gray-200 px-3 py-2.5 text-sm text-google-gray-600 hover:bg-google-gray-50"
          >
            <Activity className="size-4" strokeWidth={1.75} />
            VoC dashboard
          </Link>
        </nav>
        <div className="border-t border-google-gray-100 p-3">
          <p className="truncate px-3 text-xs text-google-gray-500">{userEmail}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-google-gray-600 hover:bg-google-gray-50"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-google-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <Logo />
            </div>
            <h1 className="text-lg font-medium text-foreground">{title ?? "Backoffice"}</h1>
            <Link
              href="/admin/start"
              className="text-sm text-google-blue hover:underline"
            >
              Admin home
            </Link>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
