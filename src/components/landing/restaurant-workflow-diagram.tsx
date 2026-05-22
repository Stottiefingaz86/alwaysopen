"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Bot,
  Calendar,
  GitBranch,
  Mail,
  Merge,
  Phone,
  PhoneForwarded,
  Reply,
  Webhook,
} from "lucide-react";

type NodeKind =
  | "webhook"
  | "calendar"
  | "if"
  | "gmail"
  | "merge"
  | "respond"
  | "phone"
  | "forward"
  | "agent"
  | "knowledge";

const NODE_STYLES: Record<
  NodeKind,
  { border: string; bg: string; icon: typeof Webhook; iconClass: string }
> = {
  webhook: {
    border: "border-violet-300",
    bg: "bg-violet-50",
    icon: Webhook,
    iconClass: "text-violet-700",
  },
  calendar: {
    border: "border-google-blue/40",
    bg: "bg-pastel-blue/50",
    icon: Calendar,
    iconClass: "text-google-blue",
  },
  if: {
    border: "border-google-green/40",
    bg: "bg-google-green/5",
    icon: GitBranch,
    iconClass: "text-google-green",
  },
  gmail: {
    border: "border-rose-300",
    bg: "bg-rose-50",
    icon: Mail,
    iconClass: "text-rose-700",
  },
  merge: {
    border: "border-google-blue/30",
    bg: "bg-white",
    icon: Merge,
    iconClass: "text-google-blue",
  },
  respond: {
    border: "border-google-gray-300",
    bg: "bg-google-gray-50",
    icon: Reply,
    iconClass: "text-google-gray-600",
  },
  phone: {
    border: "border-google-gray-300",
    bg: "bg-white",
    icon: Phone,
    iconClass: "text-google-gray-700",
  },
  forward: {
    border: "border-google-blue/50",
    bg: "bg-pastel-blue/60",
    icon: PhoneForwarded,
    iconClass: "text-google-blue",
  },
  agent: {
    border: "border-violet-300",
    bg: "bg-violet-50",
    icon: Bot,
    iconClass: "text-violet-700",
  },
  knowledge: {
    border: "border-amber-300",
    bg: "bg-amber-50",
    icon: BookOpen,
    iconClass: "text-amber-900",
  },
};

function FlowNode({
  kind,
  label,
  sublabel,
  compact,
}: {
  kind: NodeKind;
  label: string;
  sublabel?: string;
  compact?: boolean;
}) {
  const style = NODE_STYLES[kind];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 shadow-google",
        style.border,
        style.bg,
        compact ? "text-[10px]" : "text-xs"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md bg-white/80",
          style.iconClass
        )}
      >
        <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-medium text-foreground">{label}</span>
        {sublabel ? (
          <span className="block text-[10px] text-google-gray-500">{sublabel}</span>
        ) : null}
      </span>
    </div>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex justify-center py-0.5 text-google-gray-300", className)}
      aria-hidden
    >
      <span className="text-lg leading-none">↓</span>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden shrink-0 items-center self-center text-google-gray-300 sm:flex",
        className
      )}
      aria-hidden
    >
      <span className="text-base leading-none">→</span>
    </div>
  );
}

function FlowSection({
  title,
  badge,
  badgeClassName,
  borderClassName,
  children,
}: {
  title: string;
  badge: string;
  badgeClassName?: string;
  borderClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 sm:p-4",
        borderClassName ?? "border-amber-200/80 bg-amber-50/40"
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white",
            badgeClassName ?? "bg-amber-800/90"
          )}
        >
          {badge}
        </span>
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function RestaurantWorkflowDiagram({ className }: { className?: string }) {
  const { m } = useLocale();
  const w = m.industries.restaurantWorkflow;
  const n = w.nodes;
  const c = w.callPath;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-[11px] leading-relaxed text-google-gray-600">
        <span className="font-semibold text-amber-900">{w.packageLabel}</span>
        {" — "}
        {w.caption}
      </p>

      <FlowSection
        title={w.callPathTitle}
        badge={w.callPathBadge}
        badgeClassName="bg-google-blue"
        borderClassName="border-google-blue/25 bg-pastel-blue/30"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
          <FlowNode kind="phone" label={c.customerCall} compact />
          <ArrowRight />
          <FlowNode
            kind="phone"
            label={c.yourNumber}
            sublabel={c.yourNumberHint}
            compact
          />
          <ArrowRight />
          <FlowNode kind="forward" label={c.lineBusy} compact />
          <ArrowRight />
          <FlowNode
            kind="forward"
            label={c.forward}
            sublabel={c.forwardHint}
            compact
          />
          <ArrowRight />
          <FlowNode
            kind="agent"
            label={c.voiceAgent}
            sublabel={c.voiceAgentHint}
            compact
          />
        </div>
        <ArrowDown className="mt-2" />
        <FlowNode
          kind="knowledge"
          label={c.knowledgeBase}
          sublabel={c.knowledgeBaseHint}
        />
      </FlowSection>

      <p className="text-center text-[10px] font-medium uppercase tracking-wider text-google-gray-400">
        {w.automationTitle}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <FlowSection title={w.cancelTitle} badge={w.flowBadge}>
          <FlowNode kind="webhook" label={n.webhook} sublabel="POST" />
          <ArrowDown />
          <FlowNode
            kind="calendar"
            label={n.calendarGet}
            sublabel="Google Calendar"
          />
          <ArrowDown />
          <FlowNode kind="if" label={n.if} sublabel={n.ifHint} />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-dashed border-google-gray-200 bg-white/80 p-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase text-google-gray-500">
                {n.branchNo}
              </p>
              <FlowNode kind="respond" label={n.respond} compact />
            </div>
            <div className="rounded-lg border border-dashed border-google-green/30 bg-white/80 p-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase text-google-green">
                {n.branchYes}
              </p>
              <div className="space-y-1">
                <FlowNode
                  kind="calendar"
                  label={n.calendarDelete}
                  sublabel="Google Calendar"
                  compact
                />
                <ArrowDown />
                <div className="grid grid-cols-2 gap-1">
                  <FlowNode kind="gmail" label={n.gmailGuest} compact />
                  <FlowNode kind="gmail" label={n.gmailOwner} compact />
                </div>
                <ArrowDown />
                <FlowNode kind="merge" label={n.merge} compact />
                <ArrowDown />
                <FlowNode kind="respond" label={n.respond} compact />
              </div>
            </div>
          </div>
        </FlowSection>

        <FlowSection title={w.newBookingTitle} badge={w.flowBadge}>
          <FlowNode kind="webhook" label={n.webhook} sublabel="POST" />
          <ArrowDown />
          <FlowNode
            kind="calendar"
            label={n.calendarCreate}
            sublabel="Google Calendar"
          />
          <ArrowDown />
          <div className="grid grid-cols-2 gap-1.5">
            <FlowNode kind="gmail" label={n.gmailOwner} compact />
            <FlowNode kind="gmail" label={n.gmailGuest} compact />
          </div>
          <ArrowDown />
          <FlowNode kind="merge" label={n.merge} />
          <ArrowDown />
          <FlowNode kind="respond" label={n.respond} />
        </FlowSection>
      </div>
    </div>
  );
}
