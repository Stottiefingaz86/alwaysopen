"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

export function SettingsClient({
  userEmail,
  connections,
}: {
  userEmail: string;
  connections: { name: string; ok: boolean; env: string }[];
}) {
  return (
    <AdminShell userEmail={userEmail} title="Settings">
      <p className="mb-6 text-sm text-google-gray-500">
        API connection status (server environment). Keys are never shown here.
      </p>
      <ul className="space-y-3">
        {connections.map((c) => (
          <li
            key={c.name}
            className={cn(
              "flex flex-col gap-2 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
              c.ok ? "border-google-green/20 bg-white" : "border-amber-200 bg-amber-50/50"
            )}
          >
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              {!c.ok ? (
                <p className="mt-1 text-sm text-amber-900">
                  API key required — add: <code className="rounded bg-white px-1">{c.env}</code>
                </p>
              ) : (
                <p className="mt-1 text-sm text-google-gray-500">Connected</p>
              )}
            </div>
            <StatusBadge status={c.ok ? "healthy" : "warning"} />
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
