"use client";

import { N8nWorkflowField } from "@/components/admin/n8n-workflow-field";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "mt-1 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
);

const labelClass = "text-xs font-medium uppercase tracking-wide text-google-gray-500";

export type IntegrationFormValues = {
  elevenlabs_agent_id: string;
  elevenlabs_agent_url: string;
  elevenlabs_phone_number_id: string;
  n8n_booking_workflow_url: string;
  n8n_cancel_workflow_url: string;
  n8n_voc_workflow_url: string;
  google_calendar_id: string;
  twilio_number: string;
  zadarma_number: string;
  whatsapp_status: string;
  booking_platform: string;
  booking_platform_notes: string;
};

const nonN8nFields: { key: keyof IntegrationFormValues; label: string }[] = [
  { key: "elevenlabs_agent_id", label: "ElevenLabs agent ID" },
  { key: "elevenlabs_agent_url", label: "ElevenLabs agent URL" },
  { key: "elevenlabs_phone_number_id", label: "ElevenLabs phone number ID" },
  { key: "google_calendar_id", label: "Google Calendar ID" },
  { key: "twilio_number", label: "Twilio number" },
  { key: "zadarma_number", label: "Zadarma number" },
  { key: "whatsapp_status", label: "WhatsApp status" },
  { key: "booking_platform", label: "Booking platform" },
];

const n8nFields: { key: keyof IntegrationFormValues; label: string }[] = [
  { key: "n8n_booking_workflow_url", label: "n8n booking workflow" },
  { key: "n8n_cancel_workflow_url", label: "n8n cancellation workflow" },
  { key: "n8n_voc_workflow_url", label: "n8n VoC workflow" },
];

export function IntegrationFormFields({
  values,
  onChange,
  disabled,
}: {
  values: IntegrationFormValues;
  onChange: (v: IntegrationFormValues) => void;
  disabled?: boolean;
}) {
  function set<K extends keyof IntegrationFormValues>(key: K, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {nonN8nFields.map(({ key, label }) => (
        <div key={key}>
          <label className={labelClass}>{label}</label>
          <input
            className={inputClass}
            disabled={disabled}
            value={values[key]}
            onChange={(e) => set(key, e.target.value)}
          />
        </div>
      ))}

      <div className="sm:col-span-2 border-t border-google-gray-200 pt-4">
        <h3 className="text-sm font-medium text-foreground">n8n workflows</h3>
        <p className="mt-1 text-xs text-google-gray-500">
          Browse your n8n instance or paste an editor URL from the workflow page. Naming workflows
          with the client name (e.g. &quot;Demo — Book appointment&quot;) makes them easier to find.
        </p>
      </div>

      {n8nFields.map(({ key, label }) => (
        <N8nWorkflowField
          key={key}
          label={label}
          value={values[key]}
          disabled={disabled}
          onChange={(url) => set(key, url)}
        />
      ))}

      <div className="sm:col-span-2">
        <label className={labelClass}>Booking platform notes</label>
        <textarea
          rows={2}
          className={cn(inputClass, "resize-y")}
          disabled={disabled}
          value={values.booking_platform_notes}
          onChange={(e) => set("booking_platform_notes", e.target.value)}
        />
      </div>
    </div>
  );
}
