import Link from "next/link";
import type { Route } from "next";
import { Badge } from "@/components/ui/badge";
import { BilingualText } from "@/components/bilingual-text";
import type { JourneyStepConfig } from "@/data/journey";
import type { StepStatus } from "@/lib/journey-progress";

interface JourneyStepCardProps {
  step: JourneyStepConfig;
  status: StepStatus;
}

export function JourneyStepCard({ step, status }: JourneyStepCardProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <div
      className={`relative rounded-xl border bg-white p-6 shadow-sm transition-[border-color,transform] duration-200 ease-out ${
        status === "locked"
          ? "opacity-70"
          : "hover:border-primary/30 active:scale-[0.99]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle text-lg font-semibold text-primary">
          {step.step}
        </span>
        <Badge variant={statusConfig.badgeVariant}>{statusConfig.label}</Badge>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        <BilingualText text={step.title} variant="stacked" />
      </h3>

      <p className="mt-2 text-sm text-muted">
        <BilingualText text={step.description} />
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted">
          {step.estimatedMinutes} min
        </span>
        <Link
          href={step.route as Route}
          className={`text-sm font-medium ${
            status === "locked"
              ? "pointer-events-none text-muted"
              : "text-primary hover:underline"
          }`}
          aria-disabled={status === "locked"}
          tabIndex={status === "locked" ? -1 : undefined}
        >
          {statusConfig.actionLabel}
          {status === "locked" && (
            <span className="ml-1 text-xs">Locked</span>
          )}
        </Link>
      </div>
    </div>
  );
}

function getStatusConfig(status: StepStatus) {
  switch (status) {
    case "completed":
      return {
        label: "已完成 Completed",
        actionLabel: "複習 Review",
        badgeVariant: "success" as const,
      };
    case "current":
      return {
        label: "進行中 In Progress",
        actionLabel: "開始 Start",
        badgeVariant: "warning" as const,
      };
    case "locked":
      return {
        label: "鎖定 Locked",
        actionLabel: "鎖定 Locked",
        badgeVariant: "muted" as const,
      };
    case "upcoming":
    default:
      return {
        label: "待開始 Upcoming",
        actionLabel: "開始 Start",
        badgeVariant: "default" as const,
      };
  }
}
