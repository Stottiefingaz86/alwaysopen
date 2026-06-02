"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Bot,
  Clock,
  GitBranch,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  PhoneForwarded,
  Reply,
  Webhook,
} from "lucide-react";

type NodeKind =
  | "webhook"
  | "route"
  | "timely"
  | "if"
  | "gmail"
  | "whatsapp"
  | "wait"
  | "marketing"
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
  route: {
    border: "border-google-green/40",
    bg: "bg-google-green/5",
    icon: GitBranch,
    iconClass: "text-google-green",
  },
  timely: {
    border: "border-sky-300",
    bg: "bg-sky-50",
    icon: Globe,
    iconClass: "text-sky-700",
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
  whatsapp: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    icon: MessageCircle,
    iconClass: "text-emerald-700",
  },
  wait: {
    border: "border-google-gray-300",
    bg: "bg-google-gray-50",
    icon: Clock,
    iconClass: "text-google-gray-600",
  },
  marketing: {
    border: "border-pink-300",
    bg: "bg-pink-50",
    icon: Mail,
    iconClass: "text-pink-700",
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
    border: "border-pink-300",
    bg: "bg-pink-50",
    icon: BookOpen,
    iconClass: "text-pink-800",
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
        borderClassName ?? "border-pink-200/80 bg-pink-50/40"
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white",
            badgeClassName ?? "bg-pink-700"
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

function BranchColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-google-gray-200 bg-white/90 p-2.5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-google-gray-500">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function SalonWorkflowDiagram({ className }: { className?: string }) {
  const { m } = useLocale();
  const w = m.industries.salonWorkflow;
  const n = w.nodes;
  const c = w.callPath;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-[11px] leading-relaxed text-google-gray-600">
        <span className="font-semibold text-pink-800">{w.packageLabel}</span>
        {", "}
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
          <FlowNode
            kind="phone"
            label={c.yourNumber}
            sublabel={c.yourNumberHint}
            compact
          />
          <FlowNode kind="forward" label={c.lineBusy} compact />
          <FlowNode
            kind="forward"
            label={c.forward}
            sublabel={c.forwardHint}
            compact
          />
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

      <FlowSection
        title={w.pipelineTitle}
        badge={w.flowBadge}
        badgeClassName="bg-violet-600"
        borderClassName="border-violet-200/80 bg-violet-50/30"
      >
        <FlowNode kind="webhook" label={n.webhook} sublabel="POST" />
        <ArrowDown />
        <FlowNode kind="route" label={n.routeByAction} sublabel={n.routeHint} />
        <ArrowDown />

        <div className="grid gap-3 sm:grid-cols-2">
          <BranchColumn title={n.branchCheck}>
            <FlowNode kind="timely" label={n.timelyCheck} compact />
            <ArrowDown />
            <FlowNode kind="respond" label={n.respondAvailability} compact />
          </BranchColumn>

          <BranchColumn title={n.branchFallback}>
            <FlowNode kind="respond" label={n.respondUnknown} compact />
          </BranchColumn>

          <BranchColumn title={n.branchBook}>
            <FlowNode kind="timely" label={n.timelyBook} compact />
            <ArrowDown />
            <FlowNode kind="if" label={n.bookConfirmIf} sublabel={n.bookConfirmHint} compact />
            <div className="grid grid-cols-2 gap-1 pt-1">
              <FlowNode kind="gmail" label={n.emailBookConfirm} compact />
              <FlowNode kind="whatsapp" label={n.whatsappBookConfirm} compact />
            </div>
            <ArrowDown />
            <FlowNode kind="respond" label={n.respondBooked} compact />
            <p className="pt-2 text-[9px] font-medium uppercase tracking-wide text-pink-600">
              {n.parallelLabel}
            </p>
            <FlowNode kind="wait" label={n.waitMarketing} compact />
            <ArrowDown />
            <FlowNode kind="marketing" label={n.triggerMarketing} compact />
          </BranchColumn>

          <BranchColumn title={n.branchCancel}>
            <FlowNode kind="timely" label={n.timelyCancel} compact />
            <ArrowDown />
            <FlowNode kind="if" label={n.cancelConfirmIf} sublabel={n.cancelConfirmHint} compact />
            <div className="grid grid-cols-2 gap-1 pt-1">
              <FlowNode kind="gmail" label={n.emailCancelNotice} compact />
              <FlowNode kind="whatsapp" label={n.whatsappCancelNotice} compact />
            </div>
            <ArrowDown />
            <FlowNode kind="respond" label={n.respondCancelled} compact />
          </BranchColumn>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-google-gray-500">{w.footnote}</p>
      </FlowSection>
    </div>
  );
}
