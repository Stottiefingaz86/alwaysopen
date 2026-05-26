"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function MaskedField({
  value,
  label,
  className,
}: {
  value: string | null | undefined;
  label?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const display = value?.trim() ? (visible ? value : "••••••••••••") : "—";

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <p className="text-xs font-medium uppercase tracking-wide text-google-gray-500">
          {label}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-google-gray-200 bg-google-gray-50 px-3 py-2 text-sm">
          {display}
        </code>
        {value ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            <span className="sr-only">{visible ? "Hide" : "Reveal"}</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
