"use client";

import { cn } from "@/lib/utils";

const inputClass = cn(
  "mt-1 w-full rounded-lg border border-google-gray-200 bg-white px-3 py-2 text-sm",
  "outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
);

const labelClass = "text-xs font-medium uppercase tracking-wide text-google-gray-500";

export type ClientFormValues = {
  business_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_type: string;
  package_name: string;
  monthly_fee: string;
  setup_fee: string;
  included_minutes: string;
  overage_rate: string;
  status: string;
  payment_status: string;
  notes: string;
  voc_enabled: boolean;
};

export const emptyClientForm: ClientFormValues = {
  business_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  business_type: "",
  package_name: "",
  monthly_fee: "249",
  setup_fee: "499",
  included_minutes: "500",
  overage_rate: "0.30",
  status: "active",
  payment_status: "current",
  notes: "",
  voc_enabled: false,
};

export function ClientFormFields({
  values,
  onChange,
  disabled,
}: {
  values: ClientFormValues;
  onChange: (values: ClientFormValues) => void;
  disabled?: boolean;
}) {
  function set<K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>Business name *</label>
        <input
          className={inputClass}
          required
          disabled={disabled}
          value={values.business_name}
          onChange={(e) => set("business_name", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Contact name</label>
        <input
          className={inputClass}
          disabled={disabled}
          value={values.contact_name}
          onChange={(e) => set("contact_name", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Contact email</label>
        <input
          type="email"
          className={inputClass}
          disabled={disabled}
          value={values.contact_email}
          onChange={(e) => set("contact_email", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Contact phone</label>
        <input
          className={inputClass}
          disabled={disabled}
          value={values.contact_phone}
          onChange={(e) => set("contact_phone", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Business type</label>
        <input
          className={inputClass}
          disabled={disabled}
          value={values.business_type}
          onChange={(e) => set("business_type", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Package</label>
        <input
          className={inputClass}
          disabled={disabled}
          value={values.package_name}
          onChange={(e) => set("package_name", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Monthly fee (€)</label>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          disabled={disabled}
          value={values.monthly_fee}
          onChange={(e) => set("monthly_fee", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Setup fee (€)</label>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          disabled={disabled}
          value={values.setup_fee}
          onChange={(e) => set("setup_fee", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Included minutes</label>
        <input
          type="number"
          className={inputClass}
          disabled={disabled}
          value={values.included_minutes}
          onChange={(e) => set("included_minutes", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Overage rate (€/min)</label>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          disabled={disabled}
          value={values.overage_rate}
          onChange={(e) => set("overage_rate", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select
          className={inputClass}
          disabled={disabled}
          value={values.status}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="prospect">Prospect</option>
          <option value="paused">Paused</option>
          <option value="churned">Churned</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Payment status</label>
        <select
          className={inputClass}
          disabled={disabled}
          value={values.payment_status}
          onChange={(e) => set("payment_status", e.target.value)}
        >
          <option value="current">Current</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div className="sm:col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="voc_enabled"
          disabled={disabled}
          checked={values.voc_enabled}
          onChange={(e) => set("voc_enabled", e.target.checked)}
          className="size-4 rounded border-google-gray-300"
        />
        <label htmlFor="voc_enabled" className="text-sm text-google-gray-700">
          VoC reports enabled
        </label>
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Notes</label>
        <textarea
          rows={3}
          className={cn(inputClass, "resize-y")}
          disabled={disabled}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
