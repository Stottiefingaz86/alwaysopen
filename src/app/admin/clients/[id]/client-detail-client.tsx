"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  ClientFormFields,
  type ClientFormValues,
} from "@/components/admin/client-form-fields";
import {
  IntegrationFormFields,
  type IntegrationFormValues,
} from "@/components/admin/integration-form-fields";
import { MaskedField } from "@/components/admin/masked-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatEuro } from "@/lib/backoffice/format";
import { verifiedMinutesUsed, verifiedUsagePercent } from "@/lib/backoffice/usage";
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
import { parseN8nWorkflowId } from "@/lib/n8n-url";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

function isWebUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function N8nWorkflowField({
  label,
  role,
  url,
  workflowNames,
}: {
  label: string;
  role: string;
  url: string | null | undefined;
  workflowNames: Record<string, string>;
}) {
  const text = url?.trim() ?? "";
  const id = text ? parseN8nWorkflowId(text) : null;
  const n8nName = id ? workflowNames[id] : null;

  return (
    <div className="rounded-xl border border-google-gray-100 bg-google-gray-50/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-google-gray-500">{label}</p>
      <p className="mt-0.5 text-[11px] text-google-gray-500">Role: {role}</p>
      {!text ? (
        <p className="mt-2 text-sm text-google-gray-500">Not linked</p>
      ) : (
        <>
          {n8nName ? (
            <p className="mt-2 text-sm font-medium text-foreground">
              {n8nName}
              <span className="ml-2 font-normal text-google-gray-500">(in n8n)</span>
            </p>
          ) : id ? (
            <p className="mt-2 text-sm text-amber-800">Workflow ID {id} — open n8n to verify name</p>
          ) : null}
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-google-blue hover:underline"
          >
            {text}
          </a>
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  const text = value?.trim() ?? "";

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-google-gray-500">{label}</p>
      {!text ? (
        <p className="mt-1 text-sm text-foreground">—</p>
      ) : isWebUrl(text) ? (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all text-sm text-google-blue hover:underline"
        >
          {text}
        </a>
      ) : text.includes("@") && !text.includes(" ") ? (
        <a href={`mailto:${text}`} className="mt-1 block text-sm text-google-blue hover:underline">
          {text}
        </a>
      ) : (
        <p className="mt-1 text-sm text-foreground">{text}</p>
      )}
    </div>
  );
}

function clientToForm(c: Client): ClientFormValues {
  return {
    business_name: c.business_name,
    contact_name: c.contact_name ?? "",
    contact_email: c.contact_email ?? "",
    contact_phone: c.contact_phone ?? "",
    business_type: c.business_type ?? "",
    package_name: c.package_name ?? "",
    monthly_fee: String(c.monthly_fee),
    setup_fee: String(c.setup_fee),
    included_minutes: String(c.included_minutes),
    overage_rate: String(c.overage_rate),
    status: c.status,
    payment_status: c.payment_status ?? "current",
    notes: c.notes ?? "",
    voc_enabled: c.voc_enabled,
  };
}

function integrationsToForm(i: ClientIntegration | null): IntegrationFormValues {
  return {
    elevenlabs_agent_id: i?.elevenlabs_agent_id ?? "",
    elevenlabs_agent_url: i?.elevenlabs_agent_url ?? "",
    elevenlabs_phone_number_id: i?.elevenlabs_phone_number_id ?? "",
    n8n_booking_workflow_url: i?.n8n_booking_workflow_url ?? "",
    n8n_cancel_workflow_url: i?.n8n_cancel_workflow_url ?? "",
    n8n_voc_workflow_url: i?.n8n_voc_workflow_url ?? "",
    google_calendar_id: i?.google_calendar_id ?? "",
    twilio_number: i?.twilio_number ?? "",
    zadarma_number: i?.zadarma_number ?? "",
    whatsapp_status: i?.whatsapp_status ?? "",
    booking_platform: i?.booking_platform ?? "",
    booking_platform_notes: i?.booking_platform_notes ?? "",
  };
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
  elevenLabsConfigured,
  usageSyncError,
  n8nWorkflowNames,
}: {
  userEmail: string;
  client: Client;
  usage: UsageLog | null;
  integrations: ClientIntegration | null;
  credentials: ClientCredential[];
  payments: ClientPayment[];
  workflows: WorkflowHealth[];
  reports: ClientVocReport[];
  elevenLabsConfigured: boolean;
  usageSyncError?: string | null;
  n8nWorkflowNames: Record<string, string>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormValues>(() => clientToForm(client));
  const [integrationForm, setIntegrationForm] = useState<IntegrationFormValues>(() =>
    integrationsToForm(integrations)
  );
  const [checklist, setChecklist] = useState(client.onboarding_checklist);

  const used = verifiedMinutesUsed(usage);
  const included = usage?.included_minutes ?? client.included_minutes;
  const pct = verifiedUsagePercent(usage);
  const hasAgent = Boolean(integrations?.elevenlabs_agent_id?.trim());
  const [usageSyncing, setUsageSyncing] = useState(false);
  const [invoiceSending, setInvoiceSending] = useState<string | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  async function generateReport() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/backoffice/clients/${client.id}/voc-report`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdits() {
    setSaving(true);
    setSaveError(null);
    try {
      const body: Record<string, unknown> = {
        client: {
          ...form,
          monthly_fee: Number(form.monthly_fee),
          setup_fee: Number(form.setup_fee),
          included_minutes: Number(form.included_minutes),
          overage_rate: Number(form.overage_rate),
        },
      };
      if (tab === "Integrations") {
        body.integrations = integrationForm;
      }
      const res = await fetch(`/api/admin/backoffice/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setSaveError(json.error ?? "Save failed");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setSaveError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function sendInvoice(paymentId: string, kind: "monthly" | "setup") {
    setInvoiceSending(`${paymentId}:${kind}`);
    setInvoiceError(null);
    try {
      const res = await fetch(
        `/api/admin/backoffice/clients/${client.id}/payments/${paymentId}/send-invoice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind }),
        }
      );
      const json = (await res.json()) as { error?: string; sentTo?: string };
      if (!res.ok) {
        setInvoiceError(json.error ?? "Could not send invoice");
        return;
      }
      router.refresh();
    } catch {
      setInvoiceError("Could not send invoice");
    } finally {
      setInvoiceSending(null);
    }
  }

  async function refreshUsageFromElevenLabs() {
    setUsageSyncing(true);
    try {
      const res = await fetch("/api/admin/backoffice/sync-elevenlabs", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      router.refresh();
    } finally {
      setUsageSyncing(false);
    }
  }

  async function toggleChecklist(key: keyof OnboardingChecklist) {
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    await fetch(`/api/admin/backoffice/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarding_checklist: next }),
    });
    router.refresh();
  }

  const canEdit = tab === "Overview" || tab === "Integrations";

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

      <p className="mb-4 rounded-xl border border-google-gray-200 bg-google-gray-50 px-4 py-3 text-sm text-google-gray-700">
        Contract and integration fields are stored in Supabase. <strong>Billable minutes</strong>{" "}
        are fetched only from the ElevenLabs API for the current month — never entered manually.
        Set an agent ID under Integrations; usage syncs when you open this page or Admin → Usage.
      </p>

      <div className="rounded-2xl border border-google-gray-200 bg-white p-6 shadow-google">
        {canEdit ? (
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
            {editing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setForm(clientToForm(client));
                    setIntegrationForm(integrationsToForm(integrations));
                    setSaveError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" disabled={saving} onClick={saveEdits}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(clientToForm(client));
                  setIntegrationForm(integrationsToForm(integrations));
                  setEditing(true);
                }}
              >
                Edit
              </Button>
            )}
            {saveError ? <p className="w-full text-right text-sm text-google-red">{saveError}</p> : null}
          </div>
        ) : null}

        {tab === "Overview" && editing ? (
          <ClientFormFields values={form} onChange={setForm} disabled={saving} />
        ) : null}

        {tab === "Overview" && !editing && (
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

        {tab === "Integrations" && editing ? (
          <IntegrationFormFields
            values={integrationForm}
            onChange={setIntegrationForm}
            disabled={saving}
          />
        ) : null}

        {tab === "Integrations" && !editing && (
          <div className="grid gap-6 sm:grid-cols-2">
            <p className="sm:col-span-2 rounded-xl border border-google-blue/20 bg-google-blue/5 px-4 py-3 text-sm text-google-gray-800">
              Each <strong>client</strong> gets their own n8n workflow(s). Name workflows in n8n after
              the business (e.g. &quot;Mario&apos;s Bistro — bookings&quot;) — then pick them here with{" "}
              <strong>Edit</strong>. Live list: <Link href="/admin/workflows" className="text-google-blue hover:underline">Admin → Workflows</Link>.
            </p>
            <Field label="ElevenLabs agent ID" value={integrations?.elevenlabs_agent_id} />
            <Field label="ElevenLabs agent URL" value={integrations?.elevenlabs_agent_url} />
            <Field label="ElevenLabs phone number ID" value={integrations?.elevenlabs_phone_number_id} />
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium text-foreground">n8n workflows for this client</h3>
            </div>
            <N8nWorkflowField
              label="Booking"
              role="Primary reception / bookings"
              url={integrations?.n8n_booking_workflow_url}
              workflowNames={n8nWorkflowNames}
            />
            <N8nWorkflowField
              label="Cancellation"
              role="Cancellations & changes"
              url={integrations?.n8n_cancel_workflow_url}
              workflowNames={n8nWorkflowNames}
            />
            <N8nWorkflowField
              label="VoC"
              role="Voice-of-customer / insights"
              url={integrations?.n8n_voc_workflow_url}
              workflowNames={n8nWorkflowNames}
            />
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
              OAuth platforms (ElevenLabs, n8n, Google Calendar) use Google sign-in — no password is stored here.
              API keys for sync live in server env vars (<code className="rounded bg-white px-1 text-xs">ELEVENLABS_API_KEY</code>,{" "}
              <code className="rounded bg-white px-1 text-xs">N8N_API_KEY</code>).
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
            <p className="rounded-xl border border-google-gray-200 bg-google-gray-50 px-4 py-3 text-sm text-google-gray-700">
              Invoices are emailed from <strong>hello@ringsaway.com</strong> to the client contact
              email on Overview. Verify your domain in Resend for production delivery.
            </p>
            {invoiceError ? (
              <p className="text-sm text-google-red">{invoiceError}</p>
            ) : null}
            {payments.length === 0 ? (
              <p className="text-sm text-google-gray-500">No payment records.</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="rounded-xl border border-google-gray-200 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Stripe customer" value={p.stripe_customer_id} />
                    <Field label="Stripe subscription" value={p.stripe_subscription_id} />
                    <Field label="Amount" value={p.amount != null ? formatEuro(Number(p.amount)) : null} />
                    <Field label="Status" value={p.status} />
                    <Field label="Due date" value={p.due_date} />
                    <Field label="Paid date" value={p.paid_date} />
                    <Field label="Setup fee paid" value={p.setup_fee_paid ? "Yes" : "No"} />
                    <Field
                      label="Last invoice sent"
                      value={
                        p.invoice_sent_at
                          ? new Date(p.invoice_sent_at).toLocaleString()
                          : null
                      }
                    />
                    {p.invoice_url ? (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-google-gray-500">
                          Invoice link
                        </p>
                        <a
                          href={p.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block break-all text-sm text-google-blue hover:underline"
                        >
                          View invoice
                        </a>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-google-gray-100 pt-4">
                    <Button
                      type="button"
                      disabled={
                        Boolean(invoiceSending) || !client.contact_email?.trim()
                      }
                      onClick={() => sendInvoice(p.id, "monthly")}
                    >
                      {invoiceSending === `${p.id}:monthly` ? "Sending…" : "Send invoice"}
                    </Button>
                    {!p.setup_fee_paid && Number(client.setup_fee) > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          Boolean(invoiceSending) || !client.contact_email?.trim()
                        }
                        onClick={() => sendInvoice(p.id, "setup")}
                      >
                        {invoiceSending === `${p.id}:setup` ? "Sending…" : "Send setup fee invoice"}
                      </Button>
                    ) : null}
                    {!client.contact_email?.trim() ? (
                      <p className="w-full text-xs text-amber-800">
                        Add contact email on Overview to send invoices.
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "Usage" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-google-gray-600">
                Source: ElevenLabs API
                {usage?.elevenlabs_synced_at
                  ? ` · Last sync ${new Date(usage.elevenlabs_synced_at).toLocaleString()}`
                  : ""}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={usageSyncing || !elevenLabsConfigured || !hasAgent}
                onClick={refreshUsageFromElevenLabs}
              >
                {usageSyncing ? "Syncing…" : "Refresh from ElevenLabs"}
              </Button>
            </div>
            {!elevenLabsConfigured ? (
              <p className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Set <code className="rounded bg-white px-1">ELEVENLABS_API_KEY</code> on the server to
                load usage.
              </p>
            ) : null}
            {!hasAgent ? (
              <p className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Add an ElevenLabs agent ID under Integrations to sync billable minutes.
              </p>
            ) : null}
            {usageSyncError ? (
              <p className="sm:col-span-2 rounded-xl border border-google-red/20 bg-google-red/5 px-4 py-3 text-sm text-google-red">
                {usageSyncError}
              </p>
            ) : null}
            <Field
              label="Minutes used (this month)"
              value={used != null ? String(used) : "Not synced — add agent ID or refresh"}
            />
            <Field label="Included minutes" value={String(included)} />
            <Field
              label="Remaining minutes"
              value={used != null ? String(Math.max(0, included - used)) : "—"}
            />
            <Field label="Usage %" value={pct != null ? `${pct}%` : "—"} />
            <Field
              label="Overage minutes"
              value={used != null ? String(usage?.overage_minutes ?? 0) : "—"}
            />
            <Field
              label="Estimated overage cost"
              value={used != null ? formatEuro(Number(usage?.overage_cost ?? 0)) : "—"}
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
          <>
            <p className="mb-4 text-sm text-google-gray-500">Click an item to toggle and save.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(checklistLabels) as (keyof OnboardingChecklist)[]).map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggleChecklist(key)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors hover:border-google-blue/40",
                      checklist[key]
                        ? "border-google-green/30 bg-google-green/5"
                        : "border-google-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        checklist[key] ? "bg-google-green" : "bg-google-gray-300"
                      )}
                    />
                    {checklistLabels[key]}
                  </button>
                </li>
              ))}
            </ul>
          </>
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
