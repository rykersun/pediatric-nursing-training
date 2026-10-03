"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getStepStatuses } from "@/lib/journey-progress";
import { JOURNEY_STEPS } from "@/data/journey";
import { BilingualText } from "@/components/bilingual-text";

export function ProgressTracker() {
  const pathname = usePathname();
  const { progress } = useJourneyProgress();
  const statuses = getStepStatuses(progress);
  const completedCount = JOURNEY_STEPS.filter(
    (s) => statuses[s.step] === "completed",
  ).length;

  const currentStepNumber = getCurrentStepNumber(pathname);

  return (
    <nav
      aria-label="學習進度 Learning progress"
      className="border-b border-border bg-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="hidden items-center justify-between gap-2 md:flex">
          {JOURNEY_STEPS.map((step) => {
            const status = statuses[step.step];
            const isCurrent = step.step === currentStepNumber;

            return (
              <Link
                key={step.step}
                href={step.route}
                className={[
                  "group flex flex-1 flex-col items-center gap-2 rounded-md px-2 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  status === "locked" ? "pointer-events-none opacity-60" : "",
                  isCurrent
                    ? "bg-primary-subtle shadow-[inset_0_-2px_0_0_var(--primary)]"
                    : "",
                  !isCurrent && status !== "locked" ? "hover:bg-muted-background" : "",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={status === "locked"}
                tabIndex={status === "locked" ? -1 : undefined}
              >
                <StepIndicator status={status} step={step.step} />
                <span
                  className={[
                    "text-xs leading-tight",
                    isCurrent ? "font-semibold text-foreground" : "text-muted",
                  ].join(" ")}
                >
                  <BilingualText text={step.shortTitle} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile compact view */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {currentStepNumber ? (
                <>
                  步驟 {currentStepNumber} / {JOURNEY_STEPS.length}{" "}
                  <span className="text-xs text-muted">
                    Step {currentStepNumber} of {JOURNEY_STEPS.length}
                  </span>
                </>
              ) : (
                <>課程總覽 <span className="text-xs text-muted">Overview</span></>
              )}
            </span>
            <span className="text-sm text-muted">
              {completedCount} / {JOURNEY_STEPS.length} 完成
            </span>
          </div>
          <div
            className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-muted-background"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={JOURNEY_STEPS.length}
            aria-valuenow={completedCount}
            aria-label="課程完成進度 Course completion"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${(completedCount / JOURNEY_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function StepIndicator({
  status,
  step,
}: {
  status: ReturnType<typeof getStepStatuses>[number];
  step: number;
}) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold";

  switch (status) {
    case "completed":
      return (
        <span className={`${base} bg-success text-white`} aria-label="已完成 Completed">
          ✓
        </span>
      );
    case "current":
      return (
        <span className={`${base} bg-primary text-primary-foreground`}>
          {step}
        </span>
      );
    case "locked":
      return (
        <span className={`${base} bg-muted-background text-muted`} aria-label="鎖定 Locked">
          🔒
        </span>
      );
    case "upcoming":
    default:
      return (
        <span className={`${base} border border-border bg-white text-muted`}>
          {step}
        </span>
      );
  }
}

function getCurrentStepNumber(pathname: string): number | null {
  if (pathname.startsWith("/journey/step/")) {
    const step = Number(pathname.split("/").pop());
    return Number.isNaN(step) ? null : step;
  }
  if (pathname === "/journey/results") return 6;
  return null;
}
