"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { MaskedField } from "@/components/admin/masked-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatEuro, usagePercent } from "@/lib/backoffice/format";
import type {
  Client,
  ClientCredential,
  ClientIntegration,
  ClientPayment,
  ClientVocReport,
  OnboardingChecklist,
  UsageLog,
  WorkflowHealth,
} from "@/lib/backoffice/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  "Overview",
  "Integrations",
  "Credentials",
  "Payments",
  "Usage",
  "Reports",
  "Checklist",
] as const;

const checklistLabels: Record<keyof OnboardingChecklist, string> = {
  contract_signed: "Contract signed",
  setup_fee_paid: "Setup fee paid",
  agent_created: "Agent created",
  knowledge_base_added: "Knowledge base added",
  elevenlabs_tool_configured: "ElevenLabs tool configured",
  n8n_workflow_created: "n8n workflow created",
  calendar_connected: "Calendar connected",
  phone_forwarding_tested: "Phone forwarding tested",
  sms_tested: "SMS tested",
  email_tested: "Email tested",
  voc_report_enabled: "VoC report enabled",
  client_live: "Client live",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-google-gray-500">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

export function ClientDetailClient({
  userEmail,
  client,
  usage,
  integrations,
  credentials,
  payments,
  workflows,
  reports,
}: {
  userEmail: string;
  client: Client;
  usage: UsageLog | null;
  integrations: ClientIntegration | null;
  credentials: ClientCredential[];
  payments: ClientPayment[];
  workflows: WorkflowHealth[];
  reports: ClientVocReport[];
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [generating, setGenerating] = useState(false);

  const used = usage?.elevenlabs_minutes ?? 0;
  const included = usage?.included_minutes ?? client.included_minutes;
  const pct = usagePercent(used, included);

  async function generateReport() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/backoffice/clients/${client.id}/voc-report`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      window.location.reload();
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AdminShell userEmail={userEmail} title={client.business_name}>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/clients" className="text-sm text-google-blue hover:underline">
          ← Clients
        </Link>
        <StatusBadge status={client.status} />
        <StatusBadge status={client.payment_status} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-google-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "border-google-blue text-google-blue"
                : "border-transparent text-google-gray-500 hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-google-gray-200 bg-white p-6 shadow-google">
        {tab === "Overview" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Business name" value={client.business_name} />
            <Field label="Contact name" value={client.contact_name} />
            <Field label="Contact email" value={client.contact_email} />
            <Field label="Contact phone" value={client.contact_phone} />
            <Field label="Business type" value={client.business_type} />
            <Field label="Package" value={client.package_name} />
            <Field label="Monthly price" value={formatEuro(Number(client.monthly_fee))} />
            <Field label="Setup fee" value={formatEuro(Number(client.setup_fee))} />
            <Field label="Included minutes" value={String(client.included_minutes)} />
            <Field label="Overage rate" value={`€${client.overage_rate}/min`} />
            <div className="sm:col-span-2">
              <Field label="Notes" value={client.notes} />
            </div>
          </div>
        )}

        {tab === "Integrations" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="ElevenLabs agent ID" value={integrations?.elevenlabs_agent_id} />
            <Field label="ElevenLabs agent URL" value={integrations?.elevenlabs_agent_url} />
            <Field label="ElevenLabs phone number ID" value={integrations?.elevenlabs_phone_number_id} />
            <Field label="n8n booking workflow" value={integrations?.n8n_booking_workflow_url} />
            <Field label="n8n cancellation workflow" value={integrations?.n8n_cancel_workflow_url} />
            <Field label="n8n VoC workflow" value={integrations?.n8n_voc_workflow_url} />
            <Field label="Google Calendar ID" value={integrations?.google_calendar_id} />
            <Field label="Twilio number" value={integrations?.twilio_number} />
            <Field label="Zadarma number" value={integrations?.zadarma_number} />
            <Field label="WhatsApp status" value={integrations?.whatsapp_status} />
            <Field label="Booking platform" value={integrations?.booking_platform} />
            <div className="sm:col-span-2">
              <Field label="Booking platform notes" value={integrations?.booking_platform_notes} />
            </div>
          </div>
        )}

        {tab === "Credentials" && (
          <div className="space-y-6">
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Credentials are masked by default. Store secrets securely; production should use
              encrypted vault storage.
            </p>
            {credentials.length === 0 ? (
              <p className="text-sm text-google-gray-500">No credentials saved yet.</p>
            ) : (
              credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="rounded-xl border border-google-gray-200 p-4"
                >
                  <p className="font-medium">{cred.platform_name}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Login URL" value={cred.login_url} />
                    <Field label="Username" value={cred.username} />
                    <MaskedField label="Password" value={cred.encrypted_password} />
                    <MaskedField label="API key" value={cred.encrypted_api_key} />
                    <Field label="Owner" value={cred.owner} />
                    <Field label="Last updated" value={cred.last_updated} />
                    <div className="sm:col-span-2">
                      <Field label="Notes" value={cred.notes} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "Payments" && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <p className="text-sm text-google-gray-500">No payment records.</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="grid gap-4 rounded-xl border border-google-gray-200 p-4 sm:grid-cols-2">
                  <Field label="Stripe customer" value={p.stripe_customer_id} />
                  <Field label="Stripe subscription" value={p.stripe_subscription_id} />
                  <Field label="Amount" value={p.amount != null ? formatEuro(Number(p.amount)) : null} />
                  <Field label="Status" value={p.status} />
                  <Field label="Due date" value={p.due_date} />
                  <Field label="Paid date" value={p.paid_date} />
                  <Field label="Setup fee paid" value={p.setup_fee_paid ? "Yes" : "No"} />
                  {p.invoice_url ? (
                    <a
                      href={p.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-google-blue hover:underline"
                    >
                      View invoice
                    </a>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "Usage" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Minutes used (this month)" value={String(used)} />
            <Field label="Included minutes" value={String(included)} />
            <Field label="Remaining minutes" value={String(Math.max(0, included - used))} />
            <Field label="Usage %" value={`${pct}%`} />
            <Field label="Overage minutes" value={String(usage?.overage_minutes ?? 0)} />
            <Field
              label="Estimated overage cost"
              value={formatEuro(Number(usage?.overage_cost ?? 0))}
            />
            <Field label="SMS sent" value={String(usage?.sms_sent ?? 0)} />
            <Field label="Emails sent" value={String(usage?.emails_sent ?? 0)} />
            <Field label="Bookings created" value={String(usage?.bookings_created ?? 0)} />
            <Field label="Cancellations" value={String(usage?.cancellations_created ?? 0)} />
            <Field label="Failed workflows" value={String(usage?.failed_workflows ?? 0)} />
          </div>
        )}

        {tab === "Reports" && (
          <div className="space-y-4">
            <Field label="VoC enabled" value={client.voc_enabled ? "Yes" : "No"} />
            <Button type="button" onClick={generateReport} disabled={generating}>
              {generating ? "Generating…" : "Generate report (placeholder)"}
            </Button>
            <ul className="space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="font-medium">{r.month}</p>
                    <p className="text-xs text-google-gray-500">{r.public_url ?? "No URL"}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Checklist" && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(checklistLabels) as (keyof OnboardingChecklist)[]).map((key) => (
              <li
                key={key}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                  client.onboarding_checklist[key]
                    ? "border-google-green/30 bg-google-green/5"
                    : "border-google-gray-200"
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    client.onboarding_checklist[key] ? "bg-google-green" : "bg-google-gray-300"
                  )}
                />
                {checklistLabels[key]}
              </li>
            ))}
          </ul>
        )}
      </div>

      {workflows.length > 0 && tab === "Overview" ? (
        <div className="mt-6 rounded-2xl border border-google-gray-200 bg-white p-5">
          <h3 className="font-medium">Recent workflows</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {workflows.slice(0, 5).map((w) => (
              <li key={w.id} className="flex justify-between">
                <span>{w.workflow_name}</span>
                <StatusBadge status={w.health_status ?? w.status} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AdminShell>
  );
}
