"use client";

import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getFirstIncompleteStep, JOURNEY_STEPS } from "@/data/journey";
import { getCompletedSteps } from "@/lib/journey-progress";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface PrerequisiteGateProps {
  requires: number[];
  children: ReactNode;
}

export function PrerequisiteGate({ requires, children }: PrerequisiteGateProps) {
  const { progress } = useJourneyProgress();
  const completed = new Set(getCompletedSteps(progress));
  const missing = requires.filter((step) => !completed.has(step));
  const isUnlocked = missing.length === 0;

  if (isUnlocked) {
    return <>{children}</>;
  }

  const firstIncomplete = getFirstIncompleteStep(completed);

  return (
    <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted-background text-3xl">
        🔒
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        此步驟尚未解鎖
        <span className="ml-2 text-base font-normal text-muted">
          Step Locked
        </span>
      </h3>
      <p className="mx-auto mt-3 max-w-md text-muted">
        請先完成以下步驟後再回來：
        <span className="ml-1 text-sm">
          Please complete the following steps first:
        </span>
      </p>
      <ul className="mx-auto mt-4 inline-block list-disc pl-5 text-left text-sm text-muted">
        {missing.map((stepNumber) => {
          const step = JOURNEY_STEPS.find((s) => s.step === stepNumber);
          if (!step) return null;
          return (
            <li key={stepNumber}>
              {step.title.zh} <span className="text-xs">({step.title.en})</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <Button href={firstIncomplete.route}>
          前往目前步驟{" "}
          <span className="text-sm font-normal">Go to Current Step</span>
        </Button>
      </div>
    </div>
  );
}
