"use client";

import {
  ClientFormFields,
  emptyClientForm,
  type ClientFormValues,
} from "@/components/admin/client-form-fields";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddClientDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ClientFormValues>(emptyClientForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/backoffice/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          monthly_fee: Number(values.monthly_fee),
          setup_fee: Number(values.setup_fee),
          included_minutes: Number(values.included_minutes),
          overage_rate: Number(values.overage_rate),
        }),
      });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !json.id) {
        setError(json.error ?? "Could not create client");
        return;
      }
      setOpen(false);
      setValues(emptyClientForm);
      router.push(`/admin/clients/${json.id}`);
      router.refresh();
    } catch {
      setError("Could not create client");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Add client
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-google-gray-200 bg-white p-6 shadow-google-elevated">
        <h2 className="text-lg font-medium">Add client</h2>
        <form onSubmit={onCreate} className="mt-6">
          <ClientFormFields values={values} onChange={setValues} disabled={saving} />
          {error ? <p className="mt-4 text-sm text-google-red">{error}</p> : null}
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
