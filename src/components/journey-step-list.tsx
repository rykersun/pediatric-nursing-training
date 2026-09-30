"use client";

import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getStepStatuses } from "@/lib/journey-progress";
import { JOURNEY_STEPS } from "@/data/journey";
import { JourneyStepCard } from "@/components/journey-step-card";

export function JourneyStepList() {
  const { progress } = useJourneyProgress();
  const statuses = getStepStatuses(progress);

  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {JOURNEY_STEPS.map((step) => (
        <li key={step.step}>
          <JourneyStepCard step={step} status={statuses[step.step]} />
        </li>
      ))}
    </ol>
  );
}
